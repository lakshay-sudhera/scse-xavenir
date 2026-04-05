import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import { requireAdmin } from "@/lib/requireAdmin";
import User from "@/models/userModel";

// GET: look up user without modifying anything
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  try {
    await connectDB();
    const userID = req.nextUrl.searchParams.get("userID");
    if (!userID) return NextResponse.json({ error: "userID is required" }, { status: 400 });

    const user = await User.findOne({ userID }).select("userID fullName email isCollectedTshirt").lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ data: user }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST: mark goodies as collected (isCollectedTshirt = true)
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  try {
    await connectDB();
    const { userID } = await req.json();
    if (!userID) return NextResponse.json({ error: "userID is required" }, { status: 400 });

    const user = await User.findOneAndUpdate(
      { userID },
      { isCollectedTshirt: true },
      { new: true }
    ).select("userID fullName email isCollectedTshirt").lean();

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ message: "Goodies marked as collected", data: user }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
