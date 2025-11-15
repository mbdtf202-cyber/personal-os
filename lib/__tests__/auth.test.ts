import { describe, expect, it } from 'vitest'
import { createPasswordHash, verifyPassword } from '../auth'

describe('password hashing', () => {
  it('hashes and verifies passwords correctly', () => {
    const hash = createPasswordHash('MySecurePassword!')
    expect(hash).toBeDefined()
    expect(verifyPassword('MySecurePassword!', hash)).toBe(true)
    expect(verifyPassword('wrong-password', hash)).toBe(false)
  })
})
