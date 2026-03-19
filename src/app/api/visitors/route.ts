import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import Visitor from "@/models/visitorModel";

// to get visitor count by cookies
export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const cookie = req.cookies.get("visitorId");

    // If already visited → just return count
    if (cookie) {
      const data = await Visitor.findOne().lean();
      return NextResponse.json({
        count: data?.count || 0,
      });
    }

    // New visitor → increment
    const updated = await Visitor.findOneAndUpdate(
      {},
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    ).lean();

    const res = NextResponse.json({
      count: updated.count,
    });

    // Set cookie (24 hours)
    res.cookies.set("visitorId", crypto.randomUUID(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    return res;

  } catch {
    return NextResponse.json(
      { message: "Error" },
      { status: 500 }
    );
  }
}