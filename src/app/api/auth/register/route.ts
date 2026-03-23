export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role, otp } = body;

    if (!email || !password || !otp) {
      return NextResponse.json(
        { message: 'Email, password, and OTP are required' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Verify OTP
    const otpRecord = await prisma.otp.findFirst({
      where: { email, code: String(otp) }
    });

    if (!otpRecord) {
      return NextResponse.json({ message: 'Invalid OTP code' }, { status: 400 });
    }

    if (new Date() > otpRecord.expiresAt) {
      return NextResponse.json({ message: 'OTP has expired' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: role === 'ADMIN' ? 'ADMIN' : 'STUDENT',
      },
    });

    // Delete used OTPs
    await prisma.otp.deleteMany({ where: { email } });

    const token = await signToken({ userId: user.id, email: user.email, role: user.role });

    const response = NextResponse.json(
      { message: 'Registration successful', user: { id: user.id, email: user.email, role: user.role } },
      { status: 201 }
    );

    response.cookies.set('lms_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
