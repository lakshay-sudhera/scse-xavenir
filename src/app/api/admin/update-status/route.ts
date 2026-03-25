import { NextRequest, NextResponse } from "next/server";
import PendingPaymentsModel from "@/models/pendingPaymentModel";
import User from "@/models/userModel";
import { connectDB } from "@/dbConfig/dbConfig";
import { requireAdmin } from "@/lib/requireAdmin";

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  try {
    await connectDB();
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 });
    }

    if (!["verified", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const isApproved = status === "verified";

    const updated = await PendingPaymentsModel.findByIdAndUpdate(
      id,
      { status, isPending: false, isSpam: !isApproved },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    // On approval, mark the user as isPrime in the User collection
    if (isApproved && updated.email) {
      await User.findOneAndUpdate(
        { email: updated.email },
        { isPrime: true }
      );
    }

    return NextResponse.json(
      { message: `Payment ${isApproved ? "approved" : "rejected"}`, data: updated },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
