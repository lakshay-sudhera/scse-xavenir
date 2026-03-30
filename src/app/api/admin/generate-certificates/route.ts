import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { generateCertificatesForEvent, WinnerEntry } from "@/lib/certificateEngine";

export const maxDuration = 300; // 5 min — Vercel Pro allows up to 300s

export async function POST(req: NextRequest) {
  // Verify admin
  const logtok = req.cookies.get("logtok")?.value;
  if (!logtok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let decoded: any;
  try { decoded = jwt.verify(logtok, process.env.JWT_SECRET!); }
  catch { return NextResponse.json({ error: "Invalid token" }, { status: 401 }); }

  if (decoded.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { eventName, winners } = await req.json() as {
    eventName: string;
    winners?: WinnerEntry[];
  };

  if (!eventName) {
    return NextResponse.json({ error: "eventName is required" }, { status: 400 });
  }

  const result = await generateCertificatesForEvent(eventName, winners ?? []);
  return NextResponse.json({ success: true, result });
}
