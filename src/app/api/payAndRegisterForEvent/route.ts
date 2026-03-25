import { NextRequest, NextResponse } from "next/server";
import PendingEventRegistrations from "@/models/pendingEventPaymentModel";
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
      transactionId1,
      transactionId2,
      transactionId3,
    } = body;
    console.log(body);
    // ✅ Validation 
    if (!eventName || !teamName || !paymentProof || (members.length == 0) || !transactionId1) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const data = await PendingEventRegistrations.create({
      eventName,
      teamName,
      members,
      paymentProof,
      transactionId1: transactionId1,
      transactionId2: transactionId2 || "",
      transactionId3: transactionId3 || "",
      isPending: true,
      isSpam: false,
    });
    console.log("hi");
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