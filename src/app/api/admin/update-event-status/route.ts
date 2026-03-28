import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import { requireAdmin } from "@/lib/requireAdmin";
import PendingEventRegistrations from "@/models/pendingEventPaymentModel";
import EventRegistration from "@/models/eventRegistrationModel";

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  try {
    await connectDB();
    const { id, status } = await req.json();

    if (!id || !["verified", "rejected"].includes(status)) {
      return NextResponse.json({ error: "id and valid status required" }, { status: 400 });
    }

    const updated = await PendingEventRegistrations.findByIdAndUpdate(
      id,
      { status, isPending: false, isSpam: status === "rejected" },
      { new: true }
    );

    if (!updated) return NextResponse.json({ error: "Record not found" }, { status: 404 });

    // On approval — create the actual EventRegistration
    if (status === "verified") {
      const alreadyExists = await EventRegistration.findOne({
        teamName: updated.teamName,
        eventName: updated.eventName,
      });
      if (!alreadyExists) {
        await EventRegistration.create({
          teamName: updated.teamName,
          eventName: updated.eventName,
          members: updated.members,
          isAllPrime: false,
          razorpay_order_id: updated.transactionId1,
          razorpay_payment_id: updated.transactionId1,
          razorpay_signature: "manual_verified",
        });
      }
    }

    return NextResponse.json({ message: `Event registration ${status}`, data: updated }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
