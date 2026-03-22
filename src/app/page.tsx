import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.wrapper}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContainer}`}>
          <h1 className={styles.heroTitle}>
            Crack Your Dream Exam with <span className={styles.highlight}>Top Educators</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Join thousands of students achieving their goals through our structured batches, live classes, and comprehensive study materials.
          </p>
          <div className={styles.heroActions}>
            <Link href="/batches">
              <Button variant="primary" className={styles.bigButton}>Explore Batches</Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" className={styles.bigButton}>Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={styles.featuresSection}>
        <div className={`container ${styles.featuresContainer}`}>
          <h2 className={styles.sectionTitle}>Why Choose Us?</h2>
          
          <div className={styles.grid}>
            {/* Feature 1 */}
            <Card className={styles.featureCard}>
              <CardHeader>
                <div className={styles.iconWrapper}>
                  <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <CardTitle>Live Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={styles.featureText}>
                  Interactive, high-quality live sessions with top educators to clear your doubts in real-time.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className={styles.featureCard}>
              <CardHeader>
                <div className={styles.iconWrapper}>
                  <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <CardTitle>Daily Practice Problems</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={styles.featureText}>
                  Sharpen your concepts with daily DPPs specifically designed for exam-oriented learning.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className={styles.featureCard}>
              <CardHeader>
                <div className={styles.iconWrapper}>
                  <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <CardTitle>Mock Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={styles.featureText}>
                  Simulate the real exam experience with our comprehensive test series and detailed performance analytics.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
