import { connectDB } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Notification from "@/models/notificationModel";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";

async function getUser(req: NextRequest) {
  const token = req.cookies.get("logtok")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    return await User.findOne({ email: decoded.email }).select("userID").lean();
  } catch { return null; }
}

// GET: fetch notifications for logged-in user
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const notifications = await Notification.find({ userID: user.userID })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ data: notifications }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH: mark all as read
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const user = await getUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await Notification.updateMany({ userID: user.userID, read: false }, { read: true });
    return NextResponse.json({ message: "Marked as read" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
