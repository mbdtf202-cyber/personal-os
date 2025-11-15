// 环境变量验证
import { z } from 'zod'

const envSchema = z.object({
  // 数据库
  DATABASE_URL: z.string().url().optional(),

  // 应用
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),

  // 功能开关
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.string().transform((v) => v === 'true').default('true'),
  NEXT_PUBLIC_ENABLE_PWA: z.string().transform((v) => v === 'true').default('true'),
  NEXT_PUBLIC_ENABLE_OFFLINE: z.string().transform((v) => v === 'true').default('true'),

  // API 配置
  API_RATE_LIMIT: z.string().transform((v) => parseInt(v)).default('100'),
  API_TIMEOUT: z.string().transform((v) => parseInt(v)).default('30000'),
})

export type Env = z.infer<typeof envSchema>

let validatedEnv: Env | null = null

export function getEnv(): Env {
  if (validatedEnv) {
    return validatedEnv
  }

  try {
    validatedEnv = envSchema.parse(process.env)
    return validatedEnv
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:')
      error.errors.forEach((err) => {
        console.error(`  ${err.path.join('.')}: ${err.message}`)
      })
    }
    throw new Error('Invalid environment variables')
  }
}

// 验证环境变量
export function validateEnv() {
  getEnv()
  console.log('✅ Environment variables validated')
}
