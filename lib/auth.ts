import { prisma } from './prisma'

// Single user mode - no authentication required
const DEFAULT_USER_ID = 'local-user'

let userInitialized = false

export async function ensureDefaultUser() {
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
    // User already exists, ignore error
    userInitialized = true
  }

  return DEFAULT_USER_ID
}

export async function getCurrentUserId(): Promise<string> {
  return ensureDefaultUser()
}

export async function requireAuth(): Promise<string> {
  return ensureDefaultUser()
}
