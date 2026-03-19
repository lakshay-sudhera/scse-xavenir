import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import PendingPayments from "@/models/pendingPaymentModel";

export const dynamic = "force-dynamic";
// this file is for manual submission of payment details by any user
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const {
      email,
      paymentProof,
      scseId,
      transactionId1,
      transactionId2,
      transactionId3,
    } = await req.json();

    const token = req.cookies.get("logtok")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Please Login" },
        { status: 401 }
      );
    }

    if (!email || !scseId) {
      return NextResponse.json(
        { error: "Email and SCSE ID are missing" },
        { status: 400 }
      );
    }

    if (!paymentProof || !transactionId1) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 }
      );
    }
    const isSpam = false;
    // Creating a new pending payment document
    const pendingPayment = new PendingPayments({
      email,
      paymentProof,
      scseId,
      transactionId1,
      transactionId2,
      transactionId3,
      isSpam,
    });

    // Saving to the database
    await pendingPayment.save();

    return NextResponse.json({
      message: "Payment request submitted successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error submitting payment request:", error);
    return NextResponse.json({ error: "Network error" }, { status: 500 });
  }
}
