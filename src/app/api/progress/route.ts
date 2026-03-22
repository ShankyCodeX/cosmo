export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { videoId, isCompleted } = await request.json();

    if (!videoId) {
      return NextResponse.json({ message: 'Missing videoId' }, { status: 400 });
    }

    const progress = await prisma.videoProgress.upsert({
      where: {
        userId_videoId: {
          userId: session.userId as string,
          videoId: videoId as string,
        }
      },
      update: {
        isCompleted
      },
      create: {
        userId: session.userId as string,
        videoId: videoId as string,
        isCompleted
      }
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Progress error:', error);
    return NextResponse.json({ message: 'Error saving progress' }, { status: 500 });
  }
}
