'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function MarkCompleteButton({ videoId, initialCompleted }: { videoId: string, initialCompleted: boolean }) {
  const router = useRouter();
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);

  const toggleProgress = async () => {
    setLoading(true);
    const newState = !completed;
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId, isCompleted: newState }),
      });
      if (res.ok) {
        setCompleted(newState);
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to update progress');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant={completed ? 'outline' : 'primary'} 
      onClick={toggleProgress} 
      disabled={loading}
      style={{ marginTop: '1rem', width: '100%', maxWidth: '300px' }}
    >
      {loading ? 'Saving...' : completed ? '✅ Completed (Click to Undo)' : 'Mark as Complete'}
    </Button>
  );
}
