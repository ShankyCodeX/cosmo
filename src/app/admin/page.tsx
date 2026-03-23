import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import DeleteButton from './DeleteButton';
import styles from './admin.module.css';

export default async function AdminDashboard() {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    return redirect('/dashboard');
  }

  const batches = await prisma.batch.findMany({
    include: {
      _count: {
        select: { videos: true, enrollments: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const videos = await prisma.video.findMany({
    include: { batch: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return (
    <div className={`container ${styles.adminLayout}`}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Admin Controller</h1>
          <p className={styles.subtitle}>Manage your batches and content delivery</p>
        </div>
        <div className={styles.actions}>
          <Link href="/admin/upload-batch">
            <Button variant="outline">Create Batch</Button>
          </Link>
          <Link href="/admin/upload-video">
            <Button variant="primary">Upload Video</Button>
          </Link>
        </div>
      </header>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Active Batches</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Target Batch</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Lectures</TableHead>
              <TableHead>Students Enrolled</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batches.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className={styles.emptyState}>No batches created yet.</TableCell>
              </TableRow>
            )}
            {batches.map((batch: any) => (
              <TableRow key={batch.id}>
                <TableCell className={styles.strongCell}>{batch.name}</TableCell>
                <TableCell>${batch.price.toFixed(2)}</TableCell>
                <TableCell>{batch._count.videos}</TableCell>
                <TableCell>{batch._count.enrollments}</TableCell>
                <TableCell>{new Date(batch.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DeleteButton id={batch.id} type="batches" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Recent Video Uploads</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Video Link</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className={styles.emptyState}>No videos uploaded yet.</TableCell>
              </TableRow>
            )}
            {videos.map((video: any) => (
              <TableRow key={video.id}>
                <TableCell className={styles.strongCell}>{video.title}</TableCell>
                <TableCell>{video.batch.name}</TableCell>
                <TableCell>
                  <a href={video.videoUrl} target="_blank" rel="noreferrer" className={styles.link}>View Video</a>
                </TableCell>
                <TableCell>{new Date(video.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DeleteButton id={video.id} type="videos" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
