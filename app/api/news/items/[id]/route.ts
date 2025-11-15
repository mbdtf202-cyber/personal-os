import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireApiAuth, UnauthorizedError } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

const updateNewsItemSchema = z.object({
  isRead: z.boolean().optional(),
  isFavorited: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireApiAuth();
    const { id } = params;
    const body = await request.json();
    const updates = updateNewsItemSchema.parse(body);

    // Verify ownership
    const item = await prisma.newsItem.findFirst({
      where: {
        id,
        source: { userId },
      },
    });

    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const updatedItem = await prisma.newsItem.update({
      where: { id },
      data: updates,
      include: { source: true },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    logger.error('Failed to update news item', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
