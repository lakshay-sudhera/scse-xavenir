import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import { requireAdmin } from "@/lib/requireAdmin";
import PendingEventRegistrations from "@/models/pendingEventPaymentModel";
import EventRegistration from "@/models/eventRegistrationModel";
import TeamInvite from "@/models/teamInviteModel";

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
        if (updated.members.length === 1) {
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
              return NextResponse.json({ success: true,data: updated, message: "Registration created successfully" }, { status: 200 });
            }
        
            // Team registration — create invites for all non-creator members
            const invitedBy = updated.members[0];
            const otherMembers = updated.members.filter((m: string) => m !== invitedBy);
            const teamName = updated.teamName;
            const eventName = updated.eventName;
            // Delete any stale pending invites for same team+event
            await TeamInvite.deleteMany({teamName, eventName, invitedBy });
            const inviteDocs = otherMembers.map((uid: string) => ({
              teamName: updated.teamName,
              eventName: updated.eventName,
              invitedBy,
              invitedUser: uid,
              status: "pending",
              allMembers: updated.members,
              registrationPayload: {},
              registrationType: "free",
            }));
            await TeamInvite.insertMany(inviteDocs);
        
            return NextResponse.json(
              { success: true, message: `Event registration ${status}`,data: updated },
              { status: 200 }
            );
      }
    }

    return NextResponse.json({ message: `Event registration ${status}`, data: updated }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
