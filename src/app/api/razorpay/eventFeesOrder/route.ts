import Razorpay from "razorpay";
import { NextResponse, NextRequest } from "next/server";
import Event from "@/models/eventModel";

export async function POST(request: NextRequest) {
  try {
    const { eventName }: any = await request.json();
    console.log("You are registering for ", eventName);
    if (!eventName) {
      return NextResponse.json(
        { success: false, message: "Missing event name in req" },
        { status: 500 }
      );
    }
    console.log("Event is", eventName.trim());
    const event = await Event.findOne({ name: eventName.trim() });
    if (!event) {
      return NextResponse.json(
        { success: false, message: "Missing event name in db" },
        { status: 500 }
      );
    }

    const amount: number = event?.regFees;

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY!,
      key_secret: process.env.RAZORPAY_API_SECRET!,
    });

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_order_" + Math.floor(Math.random() * 1000000),
    };

    const order = await instance.orders.create(options);
    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Razorpay Order Creation Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
