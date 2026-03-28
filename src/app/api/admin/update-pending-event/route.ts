import { connectDB } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import EventRegistration from "@/models/eventRegistrationModel";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { teamName, members, eventName } = await req.json();
      const newRegistration = new EventRegistration({
        teamName, eventName, members,
        isAllPrime: true,
        razorpay_order_id: "no_need",
        razorpay_payment_id: "no_need",
        razorpay_signature: "no_need",
      });
      await newRegistration.save();
      return NextResponse.json({ success: true, message: "Registration created successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Event Registration Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
1