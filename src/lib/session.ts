import { cookies } from 'next/headers';
import { verifyToken } from './auth';

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('lms_token')?.value;

  if (!token) return null;

  const payload = await verifyToken(token);
  return payload; // { userId, email, role }
}
