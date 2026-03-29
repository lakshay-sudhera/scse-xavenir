import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "@/models/userModel";
import Rverify from "@/models/registrationFeesModel";
import { notify } from "@/lib/notify";
export async function POST(request: NextRequest) {
  await connectDB()
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await request.json();
    const logtokCookie = request.cookies.get("logtok");
    const logtok = logtokCookie?.value;
    if (!logtok) {
    return NextResponse.json(
        { error: "Unauthorized: token missing" },
        { status: 401 }
    );
    }
    let decoded;
    try {
    decoded = jwt.verify(logtok, process.env.JWT_SECRET!);
    } catch(err) {
    const res = NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
    );
    res.cookies.delete("logtok");
    return res;
    }
    const email = (decoded as any).email;

    console.log(
      razorpay_payment_id,
      "da",
      razorpay_payment_id,
      "da",
      razorpay_signature,
      email
    );
    const user = await User.findOne({ email });

    if (!user) {
      const response = NextResponse.json(
        { error: "User not found" },
        { status: 401 }
      );
      return response;
    }
    console.log(
      "recived",
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      email
    );

    const alreadyPaid = await Rverify.findOne({ email });
    if (alreadyPaid) {
      // Idempotent: just ensure isPrime is synced and return success
      if (!user.isPrime) {
        user.isPrime = true;
        await user.save();
      }
      return NextResponse.json({ success: true, message: "Payment already verified" });
    }

    const bool = await Rverify.findOne({
      razorpay_order_id: razorpay_order_id,
    });

    if (bool) {
      const response = NextResponse.json(
        { error: "Malicious activity detected, order id already exist" },
        { status: 401 }
      );
      return response;
    }

    const bool2 = await Rverify.findOne({
      razorpay_payment_id: razorpay_payment_id,
    });

    if (bool2) {
      const response = NextResponse.json(
        { error: "Malicious activity detected, payment id already exist" },
        { status: 401 }
      );
      return response;
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      console.log("payment verifed");
      user.isPrime = true;
      await user.save();
      const rverify = new Rverify({ email, razorpay_order_id, razorpay_signature, razorpay_payment_id });
      await rverify.save();
      // Notify user
      await notify({
        userID: user.userID,
        type: "prime_granted",
        title: "Registration payment successful",
        message: "Your registration payment has been verified. You now have Prime access — all events and features are unlocked.",
        meta: { razorpay_payment_id },
      });
      return NextResponse.json({ success: true, message: "Payment successfully completed",paymentId: razorpay_payment_id});
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
