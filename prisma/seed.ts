import { PrismaClient } from '@prisma/client'
import { createPasswordHash } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.SEED_USER_EMAIL ?? 'user@local.dev'
  const password = process.env.SEED_USER_PASSWORD ?? 'ChangeMe123!'
  const name = process.env.SEED_USER_NAME ?? 'Local User'

  const passwordHash = createPasswordHash(password)

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name,
      passwordHash,
      timezone: 'Asia/Shanghai',
    },
  })

  console.log(`Seed user ready: ${user.email}`)
}

main()
  .catch((error) => {
    console.error('Failed to seed database', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
