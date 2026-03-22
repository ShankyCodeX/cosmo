'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function EnrollButton({ enrolled, batchId }: { enrolled: boolean, batchId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (enrolled) {
    return (
      <Button variant="outline" className="w-full" style={{ width: '100%' }} onClick={() => router.push('/dashboard')}>
        Go to Dashboard
      </Button>
    );
  }

  const handleEnroll = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchId }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to enroll.');
      }
    } catch (err) {
      alert('An expected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="primary" 
      onClick={handleEnroll} 
      disabled={loading}
      style={{ width: '100%' }}
    >
      {loading ? 'Enrolling...' : 'Enroll Now'}
    </Button>
  );
}
