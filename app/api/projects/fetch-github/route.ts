import { NextResponse } from 'next/server';
import { z } from 'zod';
import { linkPreviewService } from '@/lib/services/link-preview';
import { logger } from '@/lib/logger';

const fetchGitHubSchema = z.object({
  url: z.string().url('Invalid URL format'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = fetchGitHubSchema.parse(body);

    // Validate it's a GitHub URL
    if (!linkPreviewService.isGitHubUrl(url)) {
      return NextResponse.json(
        { error: 'URL must be a GitHub repository URL' },
        { status: 400 }
      );
    }

    const repoInfo = await linkPreviewService.fetchGitHubRepo(url);

    return NextResponse.json(repoInfo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    logger.error('Failed to fetch GitHub repo details', {
      error: error instanceof Error ? error.message : String(error),
      requestUrl: request.url,
    });
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch GitHub repository'
      },
      { status: 500 }
    );
  }
}
