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

    if (updated.email) {
      const pt = updated.paymentType || "registration_only";
      const userUpdate: any = {};

      if (isApproved) {
        if (["reg_with_tshirt", "reg_without_tshirt", "reg_with_accom", "reg_without_accom", "registration_only"].includes(pt)) {
          userUpdate.isPrime = true;
          userUpdate.paidForPrime = "approved";
        }
        if (pt === "reg_with_tshirt" || pt === "tshirt_only") {
          userUpdate.paidForTshirt = "approved";
        }
        if (pt === "reg_with_accom" || pt === "accom_only") {
          userUpdate.paidForaccoModation = "approved";
        }

        const updatedUser = await User.findOneAndUpdate(
          { email: updated.email },
          userUpdate,
          { new: true }
        );

        if (updatedUser) {
          await notify({
            userID: updatedUser.userID,
            type: "payment_verified",
            title: "Payment verified",
            message: "Your payment has been manually verified by the admin. Check your dashboard for updated status.",
            meta: { email: updated.email },
          });
        }
      } else {
        // Rejected
        if (["reg_with_tshirt", "reg_without_tshirt", "reg_with_accom", "reg_without_accom", "registration_only"].includes(pt)) {
          userUpdate.paidForPrime = "rejected";
        }
        if (pt === "reg_with_tshirt" || pt === "tshirt_only") {
          userUpdate.paidForTshirt = "rejected";
        }
        if (pt === "reg_with_accom" || pt === "accom_only") {
          userUpdate.paidForaccoModation = "rejected";
        }
        await User.findOneAndUpdate({ email: updated.email }, userUpdate);
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