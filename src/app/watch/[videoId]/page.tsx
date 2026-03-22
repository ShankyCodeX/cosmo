import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import styles from './watch.module.css';

interface WatchPageProps {
  params: Promise<{ videoId: string }>;
}

export default async function WatchPage({ params }: WatchPageProps) {
  const session = await getSession();

  if (!session) {
    return redirect('/login');
  }

  const { videoId } = await params;

  // Find the video and its associated batch to check authorization
  const currentVideo = await prisma.video.findUnique({
    where: { id: videoId },
    include: {
      batch: {
        include: {
          videos: {
            orderBy: { createdAt: 'asc' }
          }
        }
      }
    }
  });

  if (!currentVideo) {
    return (
      <div className={`container ${styles.errorContainer}`}>
        <h1>Video not found</h1>
        <p>This lecture might have been removed or the link is invalid.</p>
        <Link href="/dashboard" className={styles.backLink}>Back to Dashboard</Link>
      </div>
    );
  }

  // Ensure user is enrolled in this batch
  const isEnrolled = await prisma.enrollment.findUnique({
    where: { 
      userId_batchId: { 
        userId: session.userId as string, 
        batchId: currentVideo.batchId 
      } 
    }
  });

  if (!isEnrolled && session.role !== 'ADMIN') {
    return (
      <div className={`container ${styles.errorContainer}`}>
        <h1>Access Denied</h1>
        <p>You must be enrolled in &quot;{currentVideo.batch.name}&quot; to view this lecture.</p>
        <Link href="/dashboard" className={styles.backLink}>Back to Dashboard</Link>
      </div>
    );
  }

  const batchVideos = currentVideo.batch.videos;

  return (
    <div className={styles.layout}>
      {/* 70% Left Side - Video Player */}
      <div className={styles.playerSection}>
        <div className={styles.videoWrapper}>
          <iframe
            src={currentVideo.videoUrl}
            title={currentVideo.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={styles.iframe}
          ></iframe>
        </div>
        
        <div className={styles.videoInfo}>
          <div className={styles.videoHeader}>
            <h1 className={styles.videoTitle}>{currentVideo.title}</h1>
            <div className={styles.controlsMock}>
              <button className={styles.speedBtn}>1.0x</button>
              <button className={styles.speedBtnActive}>1.5x</button>
              <button className={styles.speedBtn}>2.0x</button>
            </div>
          </div>
          <p className={styles.batchName}>From Batch: {currentVideo.batch.name}</p>
          {currentVideo.description && (
            <div className={styles.description}>
              <h3>Description</h3>
              <p>{currentVideo.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* 30% Right Side - Lectures List */}
      <div className={styles.playlistSection}>
        <div className={styles.playlistHeader}>
          <h2>Course Curriculum</h2>
          <span className={styles.videoCount}>{batchVideos.length} Lectures</span>
        </div>
        <div className={styles.playlistItems}>
          {batchVideos.map((video: any, idx: number) => {
            const isActive = video.id === currentVideo.id;
            return (
              <Link 
                href={`/watch/${video.id}`} 
                key={video.id}
                className={`${styles.playlistItem} ${isActive ? styles.activeItem : ''}`}
              >
                <div className={styles.itemIndex}>{idx + 1}</div>
                <div className={styles.itemDetails}>
                  <p className={styles.itemTitle}>{video.title}</p>
                  <p className={styles.itemDuration}>Video Lecture</p>
                </div>
                {isActive && (
                  <div className={styles.playingIndicator}>
                    <span className={styles.bar}></span>
                    <span className={styles.bar}></span>
                    <span className={styles.bar}></span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
