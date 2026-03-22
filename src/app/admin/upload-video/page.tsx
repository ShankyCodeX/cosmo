import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';
import UploadVideoClient from './UploadVideoClient';

export default async function UploadVideoPage() {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    return redirect('/dashboard');
  }

  const batches = await prisma.batch.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true }
  });

  return <UploadVideoClient batches={batches} />;
}
