import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import PendingPayments from "@/models/pendingPaymentModel";
import User from "@/models/userModel";

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
      paymentType,
      expectedAmount,
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
    
    if (!paymentType || expectedAmount === undefined) {
      return NextResponse.json(
        { error: "Payment type and expected amount are required" },
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
      paymentType,
      expectedAmount,
      isSpam,
    });

    // Saving to the database
    await pendingPayment.save();

    // Update User model immediately
    const userUpdate: any = {};
    if (["reg_with_tshirt", "reg_without_tshirt", "reg_with_accom", "reg_without_accom"].includes(paymentType)) {
      userUpdate.paidForPrime = "paid";
      if (paymentType === "reg_with_tshirt") userUpdate.paidForTshirt = "paid";
      if (paymentType === "reg_with_accom") userUpdate.paidForaccoModation = "paid";
    } else if (paymentType === "tshirt_only") {
      userUpdate.paidForTshirt = "paid";
    } else if (paymentType === "accom_only") {
      userUpdate.paidForaccoModation = "paid";
    }
    
    if (Object.keys(userUpdate).length > 0) {
      await User.findOneAndUpdate({ email }, userUpdate);
    }

    return NextResponse.json({
      message: "Payment request submitted successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error submitting payment request:", error);
    return NextResponse.json({ error: "Network error" }, { status: 500 });
  }
}