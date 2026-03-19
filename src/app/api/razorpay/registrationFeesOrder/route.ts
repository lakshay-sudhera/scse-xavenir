import Razorpay from "razorpay";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export interface MyTokenPayload extends jwt.JwtPayload {
  isFromCse: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("logtok")?.value;
    if (!token) {
    return NextResponse.json(
        { error: "Login required" },
        { status: 401 }
    );
    }

    let decoded;
    try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
    const res = NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
    );
    res.cookies.delete("logtok");
    return res;
    }
    const amount = 900;

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
