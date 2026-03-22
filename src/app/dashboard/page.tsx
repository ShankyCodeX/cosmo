import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import styles from './dashboard.module.css';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session || session.role !== 'STUDENT') {
    return redirect('/login');
  }

  // Fetch student's enrolled batches
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.userId as string },
    include: {
      batch: {
        include: {
          videos: true,
        }
      }
    }
  });

  return (
    <div className={`container ${styles.dashboard}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome back!</h1>
        <p className={styles.subtitle}>Here are your enrolled batches. Pick up where you left off.</p>
      </header>

      {enrollments.length === 0 ? (
        <div className={styles.emptyState}>
          <p>You haven&apos;t enrolled in any batches yet.</p>
          <Link href="/batches">
            <Button variant="primary">Explore Batches</Button>
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {enrollments.map(({ batch }: any) => {
            // Mock progression logic: 30% or 0%
            const progress = batch.videos.length > 0 ? 30 : 0; 
            
            return (
              <Card key={batch.id} className={styles.batchCard}>
                <CardHeader>
                  <CardTitle>{batch.name}</CardTitle>
                  <p className={styles.batchDesc}>{batch.description || 'No description provided.'}</p>
                </CardHeader>
                <CardContent>
                  <div className={styles.progressContainer}>
                    <div className={styles.progressHeader}>
                      <span>Course Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <p className={styles.videoCount}>{batch.videos.length} Lectures available</p>
                </CardContent>
                <CardFooter>
                  {batch.videos.length > 0 ? (
                    <Link 
                      href={`/watch/${batch.videos[0].id}`} 
                      style={{ 
                        width: '100%', 
                        display: 'block', 
                        textAlign: 'center', 
                        padding: '0.75rem 1.5rem', 
                        backgroundColor: 'var(--primary)', 
                        color: 'white', 
                        borderRadius: 'var(--radius-md)',
                        fontWeight: '500',
                        textDecoration: 'none'
                      }}>
                      Resume Learning
                    </Link>
                  ) : (
                    <Button variant="outline" className={styles.fullWidth} disabled>
                      No Lectures Yet
                    </Button>
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
