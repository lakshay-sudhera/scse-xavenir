import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { otpStore } from "../store";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("logtok")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let decoded: any;
    try { decoded = jwt.verify(token, process.env.JWT_SECRET!); }
    catch { return NextResponse.json({ error: "Invalid token" }, { status: 401 }); }

    const { otp } = await req.json();
    if (!otp) return NextResponse.json({ error: "OTP is required" }, { status: 400 });

    const record = otpStore.get(decoded.email);

    if (!record) {
      return NextResponse.json({ error: "No OTP found. Please request a new one." }, { status: 400 });
    }
    if (Date.now() > record.expiresAt) {
      otpStore.delete(decoded.email);
      return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
    }
    if (record.otp !== otp.trim()) {
      return NextResponse.json({ error: "Incorrect OTP. Please try again." }, { status: 400 });
    }

    // OTP correct — save phone as verified
    await connectDB();
    const updated = await User.findOneAndUpdate(
      { email: decoded.email },
      { phone: record.phone, phoneVerified: true },
      { new: true, select: "-password" }
    ).lean();

    otpStore.delete(decoded.email);

    return NextResponse.json({ message: "Phone verified successfully", data: updated }, { status: 200 });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
