'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import styles from '../admin.module.css';

export default function UploadBatch() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, price }),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to create batch');
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
            <CardTitle>Create a New Batch</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {error && <div className={styles.error}>{error}</div>}
              
              <div className={styles.formGroup}>
                <label htmlFor="name">Batch Name</label>
                <Input
                  id="name"
                  placeholder="e.g. Class 12th Board Target"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="price">Price ($)</label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="99.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  className={styles.textarea}
                  placeholder="Detailed layout of what this batch covers..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Button type="submit" variant="primary" disabled={loading} className={styles.submitBtn}>
                {loading ? 'Creating...' : 'Create Batch'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
