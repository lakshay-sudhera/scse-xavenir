import { connectDB } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { rateLimit, getIP } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  // 10 attempts per 15 minutes per IP
  // Rate Limiting added
  const ip = getIP(req);
  const rl = rateLimit(ip, "login", { limit: 10, windowMs: 15 * 60 * 1000 });

  if (!rl.allowed) {
    const retryAfterSec = Math.ceil(rl.retryAfterMs / 1000);
    return NextResponse.json(
      { error: `Too many login attempts. Try again in ${retryAfterSec} seconds.` },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSec),
          "X-RateLimit-Limit": "10",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  try {
    await connectDB();
    const { email, password } = await req.json();
    const user = await User.findOne({ email: email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid Credentials"},
        { status: 400 }
      );
    }
    console.log(user.userID);
    const isValid = await bcrypt.compare(password,user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid Credentials"},
        { status: 400 }
      );
    }
    const logtokPayload = {
      userID: user.userID,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    };
    const secret = process.env.JWT_SECRET || "def";
    const logtok =  jwt.sign(logtokPayload,secret, {
      expiresIn: "7d",
    });
    const response = NextResponse.json(
      {
        message: "User logged in successfully"
      },
      { status: 200 }
    );

    response.cookies.set("logtok", logtok, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    return response;
  } catch (error) {
    console.error("Error in user Login:", error);
    return NextResponse.json(
      { error: "Internal Server Error"},
      { status: 500 }
    );
  }
}
