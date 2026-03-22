import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, thumbnailUrl, videoUrl, batchId } = body;

    const video = await prisma.video.create({
      data: {
        title,
        description,
        thumbnailUrl,
        videoUrl,
        batchId,
      },
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error uploading video' }, { status: 500 });
  }
}
