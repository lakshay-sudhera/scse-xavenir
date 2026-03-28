import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import PendingPaymentsModel from "@/models/pendingPaymentModel";
import AdminClient from "./AdminClient";


async function getAdminData() {
  // ── Server-side role check ──────────────────────────
  const cookieStore = await cookies();
  const token = cookieStore.get("logtok")?.value;

  if (!token) redirect("/login");

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    redirect("/login");
  }

  await connectDB();
  const user = await User.findOne({ email: decoded.email }).select("role").lean();

  if (!user || user.role !== "admin") redirect("/");

  // ── Fetch data ──────────────────────────────────────
  const payments = await PendingPaymentsModel.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(payments));
}

export default async function AdminPage() {
  const payments = await getAdminData();
  return <AdminClient payments={payments} />;
}
