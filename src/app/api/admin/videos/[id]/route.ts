export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await prisma.video.delete({ where: { id } });
    
    return NextResponse.json({ message: 'Video deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting video' }, { status: 500 });
  }
}
