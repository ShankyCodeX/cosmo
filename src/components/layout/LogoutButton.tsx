'use client';

import { useRouter } from 'next/navigation';
import { Button } from '../ui/Button';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      // Force refresh the router to update server components (like the Navbar)
      router.refresh();
      router.push('/');
    } catch (error) {
      console.error('Logout failed');
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  );
}
