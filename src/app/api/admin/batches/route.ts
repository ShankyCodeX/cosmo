export const dynamic = 'force-dynamic';
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
    const { name, description, price } = body;

    const batch = await prisma.batch.create({
      data: {
        name,
        description,
        price: parseFloat(price) || 0,
      },
    });

    return NextResponse.json(batch, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating batch' }, { status: 500 });
  }
}
