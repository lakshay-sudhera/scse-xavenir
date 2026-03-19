import { connectDB } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import PendingEventRegistrations from "@/models/pendingEventPaymentModel";
// for non-prime nitian student other than cse branch
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const {
      eventName,
      teamName,
      paymentProof,
      members,
      transactionId1,
      transactionId2,
      transactionId3,
    } = body;
    if (
      !eventName ||
      !teamName ||
      !paymentProof ||
      !members ||
      !transactionId1
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const newRegistration = await PendingEventRegistrations.create({
      eventName,
      teamName,
      paymentProof,
      members,
      transactionId1,
      transactionId2,
      transactionId3,
      isPending: true,
      isSpam: false,
    });

    return NextResponse.json(
      { message: "Registration successful", newRegistration },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering event:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
