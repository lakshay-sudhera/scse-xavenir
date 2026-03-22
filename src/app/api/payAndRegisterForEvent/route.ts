import { NextRequest, NextResponse } from "next/server";
import PendingEventRegistrationsModel from "@/models/pendingEventPaymentModel";
import { connectDB } from "@/dbConfig/dbConfig";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      eventName,
      teamName,
      paymentProof,
      members,
      transactionId,
      transactionId2,
      transactionId3,
    } = body;

    // ✅ Validation 
    if (!eventName || !teamName || !paymentProof || !members || !transactionId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    
    const data = await PendingEventRegistrationsModel.create({
      eventName,
      teamName,
      members,
      paymentProof,
      transactionId1: transactionId,
      transactionId2: transactionId2 || "",
      transactionId3: transactionId3 || "",
      isPending: true,
      isSpam: false,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        data,
      },
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