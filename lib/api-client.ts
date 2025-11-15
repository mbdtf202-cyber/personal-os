// 类型安全的 API 客户端
import { logger } from './logger'

interface RequestOptions extends RequestInit {
  timeout?: number
  retries?: number
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  code?: string
}

export class ApiClient {
  private baseUrl: string
  private defaultTimeout: number = 30000
  private defaultRetries: number = 3

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { timeout = this.defaultTimeout, retries = this.defaultRetries, ...fetchOptions } = options
    const url = `${this.baseUrl}${endpoint}`

    let lastError: Error | null = null

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Unknown error')
        }

        return data.data as T
      } catch (error) {
        lastError = error as Error
        logger.warn(`Request failed (attempt ${attempt + 1}/${retries + 1}): ${url}`, {
          error: lastError.message,
        })

        if (attempt < retries) {
          // 指数退避
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
        }
      }
    }

    logger.error(`Request failed after ${retries + 1} attempts: ${url}`, lastError!)
    throw lastError
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()
