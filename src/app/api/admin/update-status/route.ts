import { NextRequest, NextResponse } from "next/server";
import PendingPaymentsModel from "@/models/pendingPaymentModel";
import User from "@/models/userModel";
import { connectDB } from "@/dbConfig/dbConfig";
import { requireAdmin } from "@/lib/requireAdmin";
import { notify } from "@/lib/notify";

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

    // On approval, mark the user as isPrime and send notification
    if (isApproved && updated.email) {
      const updatedUser = await User.findOneAndUpdate(
        { email: updated.email },
        { isPrime: true },
        { new: true }
      );
      if (updatedUser) {
        await notify({
          userID: updatedUser.userID,
          type: "payment_verified",
          title: "Registration payment verified",
          message: "Your registration payment has been manually verified by the admin. Prime access is now active.",
          meta: { email: updated.email },
        });
      }
    }

    return NextResponse.json(
      { message: `Payment ${isApproved ? "approved" : "rejected"}`, data: updated },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
