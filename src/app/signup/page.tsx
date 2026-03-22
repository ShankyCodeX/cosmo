'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import styles from '../login/auth.module.css';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      if (res.ok) {
        if (role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        const data = await res.json();
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.authCard}>
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <p className={styles.subtitle}>Join thousands of students learning today</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}
            
            <div className={styles.roleToggle}>
              <button
                type="button"
                className={`${styles.roleBtn} ${role === 'STUDENT' ? styles.activeRole : ''}`}
                onClick={() => setRole('STUDENT')}
              >
                Student
              </button>
              <button
                type="button"
                className={`${styles.roleBtn} ${role === 'ADMIN' ? styles.activeRole : ''}`}
                onClick={() => setRole('ADMIN')}
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" variant="primary" disabled={loading} className={styles.fullWidthBtn}>
              {loading ? 'Creating account...' : 'Sign Up Free'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className={styles.footer}>
          <p>Already have an account? <Link href="/login" className={styles.link}>Login</Link></p>
        </CardFooter>
      </Card>
    </div>
  );
}
