import Razorpay from "razorpay";
import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "@/models/userModel";
import EventRegistration from "@/models/eventRegistrationModel";
import TeamInvite from "@/models/teamInviteModel";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      teamName,
      members,
      eventName,
    } = await request.json();

    // 1) Check for missing fields
    if (
      !teamName ||
      !Array.isArray(members) ||
      !eventName ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    for (const memberId of members) {
      const user = await User.findOne({ userID: memberId });
      if (!user) {
        return NextResponse.json(
          { error: `Member not found in DB: ${memberId}` },
          { status: 404 }
        );
      }
    }
    
    //check for repeat ids
    const bool = await EventRegistration.findOne({
      razorpay_order_id: razorpay_order_id,
    });
    if (bool) {
      const response = NextResponse.json(
        { error: "Malicious activity detected, order id already exist" },
        { status: 401 }
      );
      return response;
    }

    const bool2 = await EventRegistration.findOne({
      razorpay_payment_id: razorpay_payment_id,
    });

    if (bool2) {
      const response = NextResponse.json(
        { error: "Malicious activity detected, payment id already exist" },
        { status: 401 }
      );
      return response;
    }
    //check ended

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      console.log("Verified event");

      // Solo registration — register directly
      if (members.length === 1) {
        const newRegistration = new EventRegistration({
          teamName, eventName, members, isAllPrime: false,
          razorpay_order_id, razorpay_payment_id, razorpay_signature,
        });
        await newRegistration.save();
        return NextResponse.json({ success: true, message: "Payment verified." }, { status: 200 });
      }

      // Team — identify creator from token
      let creatorUserID: string = members[0];
      try {
        const token = request.cookies.get("logtok")?.value;
        if (token) {
          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
          const creator = await User.findOne({ email: decoded.email }).select("userID").lean();
          if (creator) creatorUserID = creator.userID;
        }
      } catch { /* ignore */ }

      const invitedBy = creatorUserID;
      const otherMembers = members.filter((m: string) => m !== invitedBy);

      await TeamInvite.deleteMany({ teamName, eventName, invitedBy });

      const payload = { razorpay_order_id, razorpay_payment_id, razorpay_signature };
      const inviteDocs = otherMembers.map((uid: string) => ({
        teamName, eventName, invitedBy, invitedUser: uid,
        status: "pending", allMembers: members,
        registrationPayload: payload, registrationType: "razorpay",
      }));
      await TeamInvite.insertMany(inviteDocs);

      return NextResponse.json(
        { success: true, message: "Payment verified. Invites sent to team members." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Signature mismatch! Payment could not be verified.",
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
