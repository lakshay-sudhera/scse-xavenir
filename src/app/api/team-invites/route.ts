import { connectDB } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import TeamInvite from "@/models/teamInviteModel";
import jwt from "jsonwebtoken";

// GET: fetch invites received by the user + invites sent by the user (as leader)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get("logtok")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const User = (await import("@/models/userModel")).default;
    const user = await User.findOne({ email: decoded.email }).select("userID").lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const [received, sent] = await Promise.all([
      TeamInvite.find({ invitedUser: user.userID }).sort({ createdAt: -1 }).lean(),
      TeamInvite.find({ invitedBy: user.userID }).sort({ createdAt: -1 }).lean(),
    ]);

    return NextResponse.json({ data: received, sent }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
