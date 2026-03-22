import { connectDB } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import PendingEventRegistrationsModel from "@/models/pendingEventPaymentModel";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "id and status are required" },
        { status: 400 }
      );
    }

    if (!["verified", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const isApproved = status === "verified";

    const updated = await PendingEventRegistrationsModel.findByIdAndUpdate(
      id,
      {
        status,
        isPending: false,           // always false after admin action
        isSpam: !isApproved,        // true only on rejection
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Payment record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: `Payment ${isApproved ? "approved" : "rejected"} successfully`, data: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update status error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}