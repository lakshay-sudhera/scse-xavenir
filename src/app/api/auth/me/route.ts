// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("logtok")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
  await connectDB();
  const user = await User.findOne({ email: decoded.email }).lean();
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ user });
}