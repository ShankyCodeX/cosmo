export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendOtpEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Generate 6 digit code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Upsert the OTP in database (delete old valid ones for this email first, or just create new)
    await prisma.otp.deleteMany({ where: { email } });
    await prisma.otp.create({
      data: {
        email,
        code: otpCode,
        expiresAt,
      },
    });

    const emailSent = await sendOtpEmail(email, otpCode);
    
    if (!emailSent) {
      return NextResponse.json({ message: 'Failed to dispatch email' }, { status: 500 });
    }

    return NextResponse.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
