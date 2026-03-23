export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await prisma.batch.delete({ where: { id } });
    
    return NextResponse.json({ message: 'Batch deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting batch' }, { status: 500 });
  }
}
