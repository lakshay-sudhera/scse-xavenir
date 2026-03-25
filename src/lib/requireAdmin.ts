import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

/**
 * Call at the top of any admin API route.
 * Returns { error: NextResponse } if the request is not from an admin,
 * or { user } if it is.
 */
export async function requireAdmin(req: NextRequest): Promise<
  | { error: NextResponse; user?: never }
  | { user: { email: string; role: string }; error?: never }
> {
  const token = req.cookies.get("logtok")?.value;

  if (!token) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return {
      error: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
    };
  }

  await connectDB();
  const user = await User.findOne({ email: decoded.email }).select("email role").lean();

  if (!user) {
    return {
      error: NextResponse.json({ error: "User not found" }, { status: 401 }),
    };
  }

  if (user.role !== "admin") {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { user: { email: user.email, role: user.role } };
}
