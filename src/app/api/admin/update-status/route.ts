import { NextRequest, NextResponse } from "next/server";
import PendingEventRegistrationsModel from "@/models/pendingEventPaymentModel";
import { connectDB } from "@/dbConfig/dbConfig";

export async function POST(req: NextRequest) {
  const { id, status } = await req.json();

  await connectDB();

  await PendingEventRegistrationsModel.findByIdAndUpdate(id, {
    isPending: status === "pending",
  });

  return NextResponse.json({ success: true });
}