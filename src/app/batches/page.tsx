import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import EnrollButton from './EnrollButton';
import styles from './batches.module.css';

export default async function BatchesPage() {
  const session = await getSession();

  const batches = await prisma.batch.findMany({
    include: {
      _count: {
        select: { videos: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  let enrolledBatchIds: string[] = [];

  if (session && session.role === 'STUDENT') {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: session.userId as string },
      select: { batchId: true }
    });
    enrolledBatchIds = enrollments.map(e => e.batchId);
  }

  return (
    <div className={`container ${styles.batchesPage}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Explore Courses</h1>
        <p className={styles.subtitle}>Find the right batch for your learning goals.</p>
      </header>

      {batches.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No batches available right now. Check back soon!</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {batches.map((batch) => {
            const isEnrolled = enrolledBatchIds.includes(batch.id);
            const isFree = batch.price === 0;

            return (
              <Card key={batch.id} className={styles.batchCard}>
                <CardHeader>
                  <CardTitle>{batch.name}</CardTitle>
                  <p className={styles.batchDesc}>{batch.description}</p>
                </CardHeader>
                <CardContent>
                  <div className={styles.features}>
                    <div className={styles.featureItem}>
                      <span className={styles.icon}>🎥</span>
                      {batch._count.videos} Lectures
                    </div>
                  </div>
                  <div className={styles.priceContainer}>
                    {isFree ? (
                      <span className={styles.freeBadge}>Free</span>
                    ) : (
                      <span className={styles.price}>${batch.price.toFixed(2)}</span>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  {!session ? (
                     <div className={styles.fullWidthMsg}>Please log in to enroll.</div>
                  ) : session.role === 'ADMIN' ? (
                     <div className={styles.fullWidthMsg}>Admins cannot enroll.</div>
                  ) : isEnrolled ? (
                     <EnrollButton enrolled={true} batchId={batch.id} />
                  ) : (
                     <EnrollButton enrolled={false} batchId={batch.id} />
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
