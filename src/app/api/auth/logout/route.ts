export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out successfully' });
  
  // Remove the JWT token cookie
  response.cookies.delete('lms_token');
  
  return response;
}
