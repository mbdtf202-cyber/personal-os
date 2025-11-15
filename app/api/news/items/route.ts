import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireApiAuth, UnauthorizedError } from '@/lib/auth';
import { linkPreviewService, LinkPreviewError } from '@/lib/services/link-preview';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

const createNewsItemSchema = z.object({
  url: z.string().url('Invalid URL format'),
  sourceId: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const userId = await requireApiAuth();
    const { searchParams } = new URL(request.url);

    const type = searchParams.get('type');
    const isRead = searchParams.get('isRead');
    const isFavorited = searchParams.get('isFavorited');

    const items = await prisma.newsItem.findMany({
      where: {
        source: { userId },
        ...(type && { source: { type } }),
        ...(isRead !== null && { isRead: isRead === 'true' }),
        ...(isFavorited !== null && { isFavorited: isFavorited === 'true' }),
      },
      include: {
        source: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 50,
    });

    return NextResponse.json({ items, total: items.length });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    logger.error('Failed to get news items', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = await requireApiAuth();
    const body = await request.json();
    const { url, sourceId } = createNewsItemSchema.parse(body);

    // Fetch preview information
    const preview = await linkPreviewService.fetchPreview(url);

    // Get or create a manual source
    let source;
    if (sourceId) {
      source = await prisma.newsSource.findFirst({
        where: { id: sourceId, userId },
      });
      if (!source) {
        return NextResponse.json(
          { error: 'Source not found' },
          { status: 404 }
        );
      }
    } else {
      // Find or create default manual source
      source = await prisma.newsSource.findFirst({
        where: {
          userId,
          name: 'Manual Links',
        },
      });

      if (!source) {
        source = await prisma.newsSource.create({
          data: {
            userId,
            name: 'Manual Links',
            type: 'OTHER',
            url: '',
            fetchStrategy: 'MANUAL',
            isActive: true,
          },
        });
      }
    }

    // Create news item
    const newsItem = await prisma.newsItem.create({
      data: {
        sourceId: source.id,
        title: preview.title,
        url: preview.url,
        summary: preview.description,
        previewImage: preview.image,
        siteName: preview.siteName,
        domain: preview.domain,
        faviconUrl: preview.faviconUrl,
        type: preview.type,
        publishedAt: new Date(),
      },
      include: {
        source: true,
      },
    });

    return NextResponse.json(newsItem, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof LinkPreviewError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    logger.error('Failed to create news item', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: 'Failed to create news item' },
      { status: 500 }
    );
  }
}
