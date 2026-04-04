import { connectDB } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import EventRegistration from "@/models/eventRegistrationModel";
import TeamInvite from "@/models/teamInviteModel";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { teamName, members, eventName } = await req.json();

    if (!teamName || !Array.isArray(members) || !eventName) {
      return NextResponse.json(
        { error: "Missing required fields: teamName, members, or eventName" },
        { status: 400 }
      );
    }

    const uniqueMembers = new Set(members);
    if (uniqueMembers.size !== members.length) {
      return NextResponse.json({ error: "Duplicate entries in members array" }, { status: 400 });
    }

    // Identify the creator from the auth token
    const token = req.cookies.get("logtok")?.value;
    let creatorUserID: string | null = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        const creator = await User.findOne({ email: decoded.email }).select("userID").lean();
        if (creator) creatorUserID = creator.userID;
      } catch { /* ignore */ }
    }

    let allPrime = true;
    let allNitian = true;

    for (const memberId of members) {
      const user = await User.findOne({ userID: memberId });
      if (!user) {
        return NextResponse.json({ error: `Member not found in DB: ${memberId}` }, { status: 404 });
      }
      if (user.isNitian && user.isFromCse && !user.isPrime) {
        return NextResponse.json({ error: "CSE members must be prime, register as prime" }, { status: 400 });
      }
      if (!user.isPrime) allPrime = false;
      if (!user.isNitian) allNitian = false;
    }

    if (!allPrime && allNitian) {
      return NextResponse.json(
        { error: "All members are not Prime, pay for registration below" },
        { status: 420 }
      );
    }

    if (!allPrime) {
      return NextResponse.json({ error: "All members are not Prime, register as prime" }, { status: 400 });
    }

    // Solo registration — no invites needed
    if (members.length === 1) {
      const newRegistration = new EventRegistration({
        teamName, eventName, members,
        isAllPrime: true,
        razorpay_order_id: "no_need",
        razorpay_payment_id: "no_need",
        razorpay_signature: "no_need",
      });
      await newRegistration.save();
      return NextResponse.json({ success: true, message: "Registration created successfully" }, { status: 200 });
    }

    // Team registration — create invites for all non-creator members
    const invitedBy = creatorUserID || members[0];
    const otherMembers = members.filter((m: string) => m !== invitedBy);

    // Delete any stale pending invites for same team+event
    await TeamInvite.deleteMany({ teamName, eventName, invitedBy });

    const inviteDocs = otherMembers.map((uid: string) => ({
      teamName,
      eventName,
      invitedBy,
      invitedUser: uid,
      status: "pending",
      allMembers: members,
      registrationPayload: {},
      registrationType: "free",
    }));

    await TeamInvite.insertMany(inviteDocs);

    return NextResponse.json(
      { success: true, message: "Invites sent to team members. Registration will complete once all accept." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Event Registration Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
