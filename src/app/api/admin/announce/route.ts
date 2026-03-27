import { connectDB } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import User from "@/models/userModel";
import { notify } from "@/lib/notify";

// POST: broadcast an announcement to all users (or a specific userID)
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  try {
    await connectDB();
    const { title, message, targetUserID } = await req.json();
    if (!title || !message) {
      return NextResponse.json({ error: "title and message are required" }, { status: 400 });
    }

    if (targetUserID) {
      // Single user
      await notify({ userID: targetUserID, type: "announcement", title, message });
      return NextResponse.json({ message: "Announcement sent to user" }, { status: 200 });
    }

    // Broadcast to all users
    const users = await User.find({}).select("userID").lean();
    await notify(users.map(u => ({
      userID: u.userID,
      type: "announcement" as const,
      title,
      message,
    })));

    return NextResponse.json({ message: `Announcement sent to ${users.length} users` }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
