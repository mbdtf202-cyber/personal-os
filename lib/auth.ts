import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { prisma } from './prisma';
import { NextResponse } from 'next/server';

export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  timezone: string;
};

const SESSION_COOKIE = 'pos_session';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

function hashPassword(password: string, salt: string): string {
  const hashed = scryptSync(password, salt, 64);
  return `${salt}:${hashed.toString('hex')}`;
}

export function createPasswordHash(password: string): string {
  const salt = randomBytes(16).toString('hex');
  return hashPassword(password, salt);
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, storedHash] = stored.split(':');
  if (!salt || !storedHash) {
    return false;
  }
  const derived = scryptSync(password, salt, 64);
  const storedBuffer = Buffer.from(storedHash, 'hex');
  if (storedBuffer.length !== derived.length) {
    return false;
  }
  return timingSafeEqual(derived, storedBuffer);
}

function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

async function cleanupExpiredSession(hashedToken: string) {
  await prisma.session.deleteMany({
    where: {
      sessionToken: hashedToken,
    },
  });
}

async function getSessionFromRequest() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const hashedToken = hashSessionToken(token);
  const session = await prisma.session.findUnique({
    where: { sessionToken: hashedToken },
    include: { user: true },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt.getTime() < Date.now()) {
    await cleanupExpiredSession(hashedToken);
    (await cookies()).delete(SESSION_COOKIE);
    return null;
  }

  return session;
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const session = await getSessionFromRequest();
  if (!session) {
    return null;
  }

  const { user } = session;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar ?? null,
    timezone: user.timezone,
  };
}

export async function getCurrentUserId() {
  const session = await getSessionFromRequest();
  return session?.userId ?? null;
}

// 单用户模式 - 本地开发
const DEFAULT_USER_ID = 'local-user'

let userInitialized = false

async function ensureDefaultUser() {
  if (userInitialized) {
    return DEFAULT_USER_ID
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: DEFAULT_USER_ID },
    })

    if (!user) {
      await prisma.user.create({
        data: {
          id: DEFAULT_USER_ID,
          email: 'user@local.dev',
          name: 'Local User',
          password: 'not-used',
        },
      })
    }
    
    userInitialized = true
  } catch (error) {
    userInitialized = true
  }

  return DEFAULT_USER_ID
}

export async function requireAuth() {
  return ensureDefaultUser()
}

export async function requireApiAuth() {
  return ensureDefaultUser()
}

export async function createSession(userId: string) {
  const token = randomBytes(48).toString('hex');
  const hashedToken = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.session.create({
    data: {
      userId,
      sessionToken: hashedToken,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function invalidateSession(token: string | null) {
  if (!token) {
    return;
  }
  const hashedToken = hashSessionToken(token);
  await prisma.session.deleteMany({
    where: { sessionToken: hashedToken },
  });
}

export function attachSessionCookie(response: NextResponse, token: string, expiresAt: Date) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
  return response;
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
  });
  return response;
}

export async function getClientIp() {
  const forwardedFor = headers().get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() ?? null;
  }
  return headers().get('x-real-ip');
}
