import { connectDB } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";

// Fetch basic info for a list of userIDs
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userIDs } = await req.json();
    if (!Array.isArray(userIDs) || userIDs.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }
    const users = await User.find({ userID: { $in: userIDs } })
      .select("userID fullName collegeName profilePic")
      .lean();
    return NextResponse.json({ data: users }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
