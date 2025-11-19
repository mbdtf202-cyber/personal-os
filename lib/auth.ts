import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import type { Role } from '@prisma/client';

export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  timezone: string;
  role: Role;
};

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const session = await auth();

  if (session?.user) {
    return {
      id: session.user.id ?? 'unknown',
      email: session.user.email ?? '',
      name: session.user.name ?? 'User',
      avatar: session.user.image ?? null,
      timezone: 'Asia/Shanghai', // Default or fetch from DB if extended
      role: 'USER' as Role, // Default or fetch from DB if extended
    };
  }

  // DEV BYPASS: Return mock user in development if no session
  if (process.env.NODE_ENV === 'development') {
    return {
      id: 'dev-user-id',
      email: 'dev@local.com',
      name: 'Dev User',
      avatar: null,
      timezone: 'Asia/Shanghai',
      role: 'ADMIN',
    };
  }

  return null;
}

export async function getCurrentUserId() {
  const user = await getCurrentUser();
  return user?.id ?? null;
}

export async function requireAuth() {
  const userId = await getCurrentUserId();
  if (!userId) {
    // redirect('/api/auth/signin'); // Optional: redirect to signin
    throw new UnauthorizedError();
  }
  return userId;
}

export async function requireApiAuth() {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new UnauthorizedError();
  }
  return userId;
}

export async function requirePageAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/api/auth/signin');
  }
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    throw new UnauthorizedError();
  }
  if (user.role !== 'ADMIN') {
    throw new UnauthorizedError('Admin privileges required');
  }
  return user;
}

export async function getClientIp() {
  const forwardedFor = (await headers()).get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() ?? null;
  }
  return (await headers()).get('x-real-ip');
}

