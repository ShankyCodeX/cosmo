import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (to: string, code: string) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn(`\n[DEV MODE] 🚨 Email credentials missing in .env!`);
    console.warn(`[DEV MODE] 📧 Mocking OTP email to ${to}`);
    console.warn(`[DEV MODE] 🔑 OTP CODE: ${code}\n`);
    return true; // Simulate success
  }

  try {
    await transporter.sendMail({
      from: `"Cosmo Academy" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Your Cosmo Academy Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8fafc; border-radius: 8px; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0;">
          <h2 style="color: #0f172a; margin-bottom: 20px;">Welcome to Cosmo Academy!</h2>
          <p style="color: #475569; font-size: 16px;">Please use the following 6-digit code to verify your email address and complete your registration.</p>
          <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; text-align: center; margin: 25px 0; border: 1px solid #e2e8f0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #4f46e5;">${code}</span>
          </div>
          <p style="color: #94a3b8; font-size: 14px;">This code will expire in 10 minutes. If you did not request this code, please ignore this email.</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
};
