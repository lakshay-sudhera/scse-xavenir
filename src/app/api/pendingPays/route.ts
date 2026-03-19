import { connectDB } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import PendingPayments from "../../../models/pendingPaymentModel";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    //  Find ANY record for this email
    const userPayment = await PendingPayments.findOne({ email });

    // Case 1: Email not found
    if (!userPayment) {
      return NextResponse.json(
        {
          exists: false,
          isPending: false,
          message: "User has not submitted payment",
        },
        { status: 200 }
      );
    }

    // Case 2 & 3: Email exists
    return NextResponse.json(
      {
        exists: true,
        isPending: userPayment.isPending,
        message: userPayment.isPending
          ? "Payment verification is pending"
          : "Payment already verified",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching payment status:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}