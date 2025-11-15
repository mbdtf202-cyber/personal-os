import { describe, expect, it, beforeEach, vi } from 'vitest'
import axios from 'axios'
import { linkPreviewService, LinkPreviewError } from '../link-preview'

vi.mock('axios', () => ({
  default: {
    head: vi.fn(),
    get: vi.fn(),
  },
}))

const mockedAxios = axios as unknown as {
  head: ReturnType<typeof vi.fn>
  get: ReturnType<typeof vi.fn>
}

describe('LinkPreviewService', () => {
  beforeEach(() => {
    mockedAxios.head.mockReset()
    mockedAxios.get.mockReset()
  })

  it('rejects unsupported protocols', async () => {
    await expect(linkPreviewService.fetchPreview('ftp://example.com')).rejects.toBeInstanceOf(
      LinkPreviewError
    )
  })

  it('rejects private network hosts', async () => {
    await expect(linkPreviewService.fetchPreview('http://127.0.0.1/test')).rejects.toBeInstanceOf(
      LinkPreviewError
    )
  })

  it('rejects when preflight detects oversized response', async () => {
    mockedAxios.head.mockResolvedValue({
      headers: { 'content-length': String(10 * 1024 * 1024) },
    })

    await expect(linkPreviewService.fetchPreview('https://example.com'))
      .rejects.toThrowError(LinkPreviewError)
  })

  it('returns preview data for valid pages', async () => {
    mockedAxios.head.mockResolvedValue({ headers: {} })
    mockedAxios.get.mockResolvedValue({
      data: `
        <html>
          <head>
            <meta property="og:title" content="Example Title" />
            <meta property="og:description" content="Example description" />
            <meta property="og:image" content="https://example.com/image.png" />
            <meta property="og:site_name" content="Example" />
          </head>
        </html>
      `,
    })

    const preview = await linkPreviewService.fetchPreview('https://example.com/article')

    expect(preview.title).toBe('Example Title')
    expect(preview.description).toContain('Example description')
    expect(preview.image).toBe('https://example.com/image.png')
  })
})
