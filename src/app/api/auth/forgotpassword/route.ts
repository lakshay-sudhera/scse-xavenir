import { connectDB } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    // Always return 200 to avoid leaking whether an email exists
    if (!user) {
      return NextResponse.json(
        { message: "If that email exists, a reset link has been sent." },
        { status: 200 }
      );
    }

    // Sign a short-lived reset token with the user's current hashed password
    // as part of the secret — this invalidates the token once password changes
    const secret = `${process.env.JWT_SECRET}${user.password}`;
    const resetToken = jwt.sign(
      { userID: user.userID, email: user.email },
      secret,
      { expiresIn: "15m" }
    );

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/resetpassword?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // Send email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // use an App Password, not your main password
      },
    });

    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
          <h2>Reset Your Password</h2>
          <p>Hi ${user.fullName},</p>
          <p>We received a request to reset your password. Click the button below — this link expires in <strong>15 minutes</strong>.</p>
          <a href="${resetLink}"
            style="display:inline-block;margin-top:16px;padding:12px 24px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;">
            Reset Password
          </a>
          <p style="margin-top:24px;color:#6b7280;font-size:13px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: "If that email exists, a reset link has been sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}