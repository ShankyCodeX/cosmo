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
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStep(2);
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role, otp }),
      });

      if (res.ok) {
        if (role === 'ADMIN') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/dashboard';
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
          <form onSubmit={step === 1 ? handleSendOtp : handleSignup} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            {step === 1 ? (
              <>
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
                  {loading ? 'Sending Verification...' : 'Send Verification Code'}
                </Button>
              </>
            ) : (
              <>
                <div style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  We sent a 6-digit confirmation code to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="otp">Verification Code</label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                    style={{ textAlign: 'center', fontSize: '1.25rem', letterSpacing: '0.25rem' }}
                  />
                </div>

                <Button type="submit" variant="primary" disabled={loading} className={styles.fullWidthBtn}>
                  {loading ? 'Creating account...' : 'Verify & Create Account'}
                </Button>
                
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  style={{ width: '100%', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}
                >
                  &larr; Back to email
                </button>
              </>
            )}
          </form>
        </CardContent>
        <CardFooter className={styles.footer}>
          <p>Already have an account? <Link href="/login" className={styles.link}>Login</Link></p>
        </CardFooter>
      </Card>
    </div>
  );
}
