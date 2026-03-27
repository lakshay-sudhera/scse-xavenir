import { NextRequest, NextResponse } from "next/server";
import PendingEventRegistrations from "@/models/pendingEventPaymentModel";
import TeamInvite from "@/models/teamInviteModel";
import { connectDB } from "@/dbConfig/dbConfig";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { eventName, teamName, paymentProof, members, transactionId1, transactionId2, transactionId3 } = body;

    if (!eventName || !teamName || !paymentProof || members.length === 0 || !transactionId1) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Solo — store directly in pending
    if (members.length === 1) {
      const data = await PendingEventRegistrations.create({
        eventName, teamName, members, paymentProof,
        transactionId1, transactionId2: transactionId2 || "", transactionId3: transactionId3 || "",
        isPending: true, isSpam: false,
      });
      return NextResponse.json({ success: true, message: "Registration successful", data }, { status: 201 });
    }

    // Team — identify creator from token
    let creatorUserID: string = members[0];
    try {
      const token = req.cookies.get("logtok")?.value;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        const creator = await User.findOne({ email: decoded.email }).select("userID").lean();
        if (creator) creatorUserID = creator.userID;
      }
    } catch { /* ignore */ }

    const invitedBy = creatorUserID;
    const otherMembers = members.filter((m: string) => m !== invitedBy);

    await TeamInvite.deleteMany({ teamName, eventName, invitedBy });

    const payload = { paymentProof, transactionId1, transactionId2: transactionId2 || "", transactionId3: transactionId3 || "" };
    const inviteDocs = otherMembers.map((uid: string) => ({
      teamName, eventName, invitedBy, invitedUser: uid,
      status: "pending", allMembers: members,
      registrationPayload: payload, registrationType: "manual",
    }));
    await TeamInvite.insertMany(inviteDocs);

    return NextResponse.json(
      { success: true, message: "Invites sent to team members. Registration will complete once all accept." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering event:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
