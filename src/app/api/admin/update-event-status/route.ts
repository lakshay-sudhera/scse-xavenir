import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import { requireAdmin } from "@/lib/requireAdmin";
import PendingEventRegistrations from "@/models/pendingEventPaymentModel";
import EventRegistration from "@/models/eventRegistrationModel";
import { notify } from "@/lib/notify";

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
        const newRegistration = new EventRegistration({
          teamName: updated.teamName,
          eventName: updated.eventName,
          members: updated.members,
          isAllPrime: true,
          razorpay_order_id: "no_need",
          razorpay_payment_id: updated.transactionId1,
          razorpay_signature: "no_need",
        });
        await newRegistration.save();

        // Notify all team members of approval
        await notify(updated.members.map((uid: string) => ({
          userID: uid,
          type: "payment_verified" as const,
          title: "Event registration approved",
          message: `Your team "${updated.teamName}" has been approved for ${updated.eventName}.`,
          meta: { teamName: updated.teamName, eventName: updated.eventName },
        })));

        return NextResponse.json({ success: true, data: updated, message: "Registration created successfully" }, { status: 200 });
      }
    }

    // On rejection — notify the team leader
    if (status === "rejected") {
      await notify({ 
        userID: updated.members[0],
        type: "payment_verified" as const,
        title: "Event registration rejected",
        message: `Your team "${updated.teamName}" registration for ${updated.eventName} was rejected.`,
        meta: { teamName: updated.teamName, eventName: updated.eventName },
  })};

    return NextResponse.json({ message: `Event registration ${status}`, data: updated }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
