'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';

export function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      // Force a hard browser refresh to completely clear the Next.js 15 App Router cache
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed');
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout} disabled={loading}>
      {loading ? 'Logging out...' : 'Logout'}
    </Button>
  );
}
