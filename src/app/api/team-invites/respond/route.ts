import { connectDB } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import TeamInvite from "@/models/teamInviteModel";
import EventRegistration from "@/models/eventRegistrationModel";
import PendingEventRegistrations from "@/models/pendingEventPaymentModel";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get("logtok")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const User = (await import("@/models/userModel")).default;
    const user = await User.findOne({ email: decoded.email }).select("userID").lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { inviteId, action } = await req.json(); // action: "accept" | "reject"
    if (!inviteId || !["accept", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const invite = await TeamInvite.findById(inviteId);
    if (!invite) return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    if (invite.invitedUser !== user.userID) {
      return NextResponse.json({ error: "Not your invite" }, { status: 403 });
    }
    if (invite.status !== "pending") {
      return NextResponse.json({ error: "Invite already responded to" }, { status: 400 });
    }

    invite.status = action === "accept" ? "accepted" : "rejected";
    await invite.save();

    if (action === "reject") {
      // Mark all sibling invites for this team as rejected too
      await TeamInvite.updateMany(
        { teamName: invite.teamName, eventName: invite.eventName, invitedBy: invite.invitedBy, status: "pending" },
        { status: "rejected" }
      );
      return NextResponse.json({ message: "Invite rejected" }, { status: 200 });
    }

    // Check if all invites for this team are accepted
    const allInvites = await TeamInvite.find({
      teamName: invite.teamName,
      eventName: invite.eventName,
      invitedBy: invite.invitedBy,
    });

    const allAccepted = allInvites.every(inv => inv.status === "accepted");
    if (!allAccepted) {
      return NextResponse.json({ message: "Accepted — waiting for other members" }, { status: 200 });
    }

    // All accepted — finalize registration
    const payload = invite.registrationPayload;
    const type = invite.registrationType;

    if (type === "free") {
      const newReg = new EventRegistration({
        teamName: invite.teamName,
        eventName: invite.eventName,
        members: invite.allMembers,
        isAllPrime: true,
        razorpay_order_id: "no_need",
        razorpay_payment_id: "no_need",
        razorpay_signature: "no_need",
      });
      await newReg.save();
    } else if (type === "razorpay") {
      const newReg = new EventRegistration({
        teamName: invite.teamName,
        eventName: invite.eventName,
        members: invite.allMembers,
        isAllPrime: false,
        razorpay_order_id: payload.razorpay_order_id,
        razorpay_payment_id: payload.razorpay_payment_id,
        razorpay_signature: payload.razorpay_signature,
      });
      await newReg.save();
    } else if (type === "manual") {
      await PendingEventRegistrations.create({
        eventName: invite.eventName,
        teamName: invite.teamName,
        members: invite.allMembers,
        paymentProof: payload.paymentProof,
        transactionId1: payload.transactionId1,
        transactionId2: payload.transactionId2 || "",
        transactionId3: payload.transactionId3 || "",
        isPending: true,
        isSpam: false,
      });
    }

    return NextResponse.json({ message: "All members accepted — team registered!" }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
