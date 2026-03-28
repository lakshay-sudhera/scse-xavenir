import { connectDB } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import User from "@/models/userModel";
import EventRegistration from "@/models/eventRegistrationModel";
import { notify } from "@/lib/notify";

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  try {
    await connectDB();
    const { title, message, targetUserID, eventName } = await req.json();
    if (!title || !message) {
      return NextResponse.json({ error: "title and message are required" }, { status: 400 });
    }

    // Single user
    if (targetUserID) {
      await notify({ userID: targetUserID, type: "announcement", title, message, meta: { eventName } });
      return NextResponse.json({ message: "Announcement sent to user" }, { status: 200 });
    }

    // Event-specific broadcast
    if (eventName) {
      const regs = await EventRegistration.find({ eventName }).select("members").lean();
      const memberSet = new Set<string>();
      regs.forEach(r => r.members.forEach(m => memberSet.add(m)));
      const userIDs = Array.from(memberSet);
      if (userIDs.length === 0) {
        return NextResponse.json({ error: "No participants found for this event" }, { status: 404 });
      }
      await notify(userIDs.map(uid => ({
        userID: uid,
        type: "announcement" as const,
        title,
        message,
        meta: { eventName },
      })));
      return NextResponse.json({ message: `Announcement sent to ${userIDs.length} participants of "${eventName}"` }, { status: 200 });
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
