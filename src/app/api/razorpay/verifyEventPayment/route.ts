import Razorpay from "razorpay";
import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "@/models/userModel";
import EventRegistration from "@/models/eventRegistrationModel";

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
      const newRegistration = new EventRegistration({
        teamName,
        eventName,
        members,
        isAllPrime: false,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
      await newRegistration.save();

      return NextResponse.json(
        {
          success: true,
          message: "Payment verified.",
        },
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
