import Link from 'next/link';
import { Button } from '../ui/Button';
import styles from './Navbar.module.css';
import { getSession } from '@/lib/session';
import { LogoutButton } from './LogoutButton';

export async function Navbar() {
  const session = await getSession();

  return (
    <header className={styles.header}>
      <div className={`container ${styles.nav}`}>
        <Link href="/" className={styles.brand}>
          Cosmo <span className={styles.highlight}>Academy</span>
        </Link>
        <div className={styles.actions}>
          <Link href="/batches">
            <Button variant="ghost">Browse Courses</Button>
          </Link>
          
          {session ? (
            <>
              <Link href={session.role === 'ADMIN' ? '/admin' : '/dashboard'}>
                <Button variant="ghost">{session.role === 'ADMIN' ? 'Admin Panel' : 'My Dashboard'}</Button>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary">Sign Up Free</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
