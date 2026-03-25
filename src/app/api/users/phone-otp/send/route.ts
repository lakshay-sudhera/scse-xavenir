import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { otpStore } from "../store";

// In-memory OTP store: { email -> { otp, phone, expiresAt } }
// For production, use Redis or a DB collection
// const otpStore = new Map<string, { otp: string; phone: string; expiresAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("logtok")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let decoded: any;
    try { decoded = jwt.verify(token, process.env.JWT_SECRET!); }
    catch { return NextResponse.json({ error: "Invalid token" }, { status: 401 }); }

    const { phone } = await req.json();
    if (!phone || !/^\+?[0-9]{7,15}$/.test(phone.replace(/\s/g, ""))) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: decoded.email }).select("email fullName").lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(decoded.email, { otp, phone, expiresAt });

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"SCSE Xavenir" <${process.env.EMAIL_USER}>`,
      to: decoded.email,
      subject: "Phone Verification OTP — Xavenir",
      html: `
        <div style="font-family:'Courier New',monospace;background:#020010;color:#00f5ff;padding:32px;max-width:480px;margin:auto;border:1px solid rgba(0,245,255,0.2);">
          <h2 style="color:#00f5ff;letter-spacing:4px;margin-bottom:8px;">PHONE VERIFICATION</h2>
          <p style="color:rgba(180,200,255,0.7);margin-bottom:24px;">Hi ${user.fullName}, use the OTP below to verify your phone number <strong style="color:#fff">${phone}</strong>.</p>
          <div style="background:rgba(0,245,255,0.08);border:1px solid rgba(0,245,255,0.3);padding:20px;text-align:center;margin-bottom:24px;">
            <span style="font-size:2.5rem;font-weight:900;letter-spacing:12px;color:#00f5ff;text-shadow:0 0 20px #00f5ff;">${otp}</span>
          </div>
          <p style="color:rgba(180,200,255,0.5);font-size:0.8rem;">This OTP expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
        </div>
      `,
    });

    return NextResponse.json({ message: "OTP sent to your registered email" }, { status: 200 });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}

// Export store for use in verify route (same process)
// export { otpStore };
