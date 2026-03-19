import { connectDB } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();
    const user = await User.findOne({ email: email });
    if (!user) {
      return NextResponse.json(
        { error: "Email id does not exists"},
        { status: 400 }
      );
    }
    console.log(user.userID);
    const isValid = await bcrypt.compare(password,user.password);
    if (!isValid) throw new Error("Invalid password");
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
