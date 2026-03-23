'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteButton({ id, type }: { id: string, type: 'batches' | 'videos' }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you absolutely sure you want to permanently delete this ${type === 'batches' ? 'batch' : 'video'}?`)) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/${type}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to delete resource from database.');
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred during deletion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={loading}
      style={{ 
        color: 'var(--destructive)', 
        fontSize: '0.875rem', 
        fontWeight: 600, 
        padding: '0.25rem 0.5rem', 
        borderRadius: 'var(--radius-sm)', 
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        cursor: 'pointer',
        border: '1px solid transparent',
        transition: 'all 0.2s'
      }}
      onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)'}
      onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}
    >
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
}
