import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/dbConfig/dbConfig";
import CertificateModel from "@/models/certificateModel";

export async function GET(req: NextRequest) {
  const logtok = req.cookies.get("logtok")?.value;
  if (!logtok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let decoded: any;
  try { decoded = jwt.verify(logtok, process.env.JWT_SECRET!); }
  catch { return NextResponse.json({ error: "Invalid token" }, { status: 401 }); }

  await connectDB();
  const certificates = await CertificateModel.find({ userID: decoded.userID }).sort({ issuedAt: -1 });
  return NextResponse.json({ certificates });
}
