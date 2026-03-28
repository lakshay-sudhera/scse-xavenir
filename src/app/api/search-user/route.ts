import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

// to search a person to check does it got goodies or not
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userID } = await req.json();
    if (!userID) {
      return NextResponse.json(
        { message: "ID is required" },
        { status: 400 }
      );
    }
    const user = await User.findOne({ userID }).lean();
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      email: user.email,
      name: user.fullName,
      id: user.userID,
      isPrime: user.isPrime,
      goodiesCollected: user.b1,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}