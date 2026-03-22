'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import styles from '../admin.module.css';

interface Batch {
  id: string;
  name: string;
}

export default function UploadVideoClient({ batches }: { batches: Batch[] }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [batchId, setBatchId] = useState(batches.length > 0 ? batches[0].id : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchId) {
      setError('Please select a batch first. If there are none, create a batch before uploading a video.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, videoUrl, thumbnailUrl, batchId }),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to upload video');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container ${styles.formContainer}`}>
      <Link href="/admin" className={styles.link}>&larr; Back to Admin Dashboard</Link>
      <div style={{ marginTop: '1.5rem' }}>
        <Card className={styles.formCard}>
          <CardHeader>
            <CardTitle>Upload Lecture</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {error && <div className={styles.error}>{error}</div>}
              
              <div className={styles.formGroup}>
                <label htmlFor="batchId">Select Batch</label>
                <select
                  id="batchId"
                  className={styles.select}
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  required
                >
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                  {batches.length === 0 && <option value="">No batches available</option>}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="title">Video Title</label>
                <Input
                  id="title"
                  placeholder="e.g. Physics 01: Motion in 1D"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="videoUrl">Video URL / Embed URL</label>
                <Input
                  id="videoUrl"
                  type="url"
                  placeholder="https://www.youtube.com/embed/..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="thumbnailUrl">Thumbnail URL (Optional)</label>
                <Input
                  id="thumbnailUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  className={styles.textarea}
                  placeholder="Notes about this lecture..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Button type="submit" variant="primary" disabled={loading || batches.length === 0} className={styles.submitBtn}>
                {loading ? 'Uploading...' : 'Publish Lecture'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
