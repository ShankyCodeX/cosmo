import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Unauthorized. Only students can enroll.' }, { status: 401 });
    }

    const { batchId } = await request.json();

    if (!batchId) {
      return NextResponse.json({ message: 'Batch ID is required' }, { status: 400 });
    }

    // Upsert or Create Enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: session.userId as string,
        batchId: batchId as string,
      }
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error enrolling in batch. You might already be enrolled.' }, { status: 500 });
  }
}
