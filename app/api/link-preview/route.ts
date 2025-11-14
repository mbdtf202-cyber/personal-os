import { NextResponse } from 'next/server';
import { z } from 'zod';
import { linkPreviewService } from '@/lib/services/link-preview';

const linkPreviewSchema = z.object({
  url: z.string().url('Invalid URL format'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = linkPreviewSchema.parse(body);

    // Validate URL is not localhost or internal
    const urlObj = new URL(url);
    if (
      urlObj.hostname === 'localhost' ||
      urlObj.hostname === '127.0.0.1' ||
      urlObj.hostname.endsWith('.local')
    ) {
      return NextResponse.json(
        { error: 'Cannot fetch preview from local URLs' },
        { status: 400 }
      );
    }

    const preview = await linkPreviewService.fetchPreview(url);

    return NextResponse.json(preview);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Failed to fetch link preview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch link preview' },
      { status: 500 }
    );
  }
}
