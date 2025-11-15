import { NextResponse } from 'next/server';
import { z } from 'zod';
import { linkPreviewService, LinkPreviewError } from '@/lib/services/link-preview';
import { logger } from '@/lib/logger';

const linkPreviewSchema = z.object({
  url: z.string().url('Invalid URL format'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = linkPreviewSchema.parse(body);

    const preview = await linkPreviewService.fetchPreview(url);

    return NextResponse.json(preview);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof LinkPreviewError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    logger.error('Failed to fetch link preview', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: 'Failed to fetch link preview' },
      { status: 500 }
    );
  }
}
