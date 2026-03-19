import Event from "@/models/eventModel";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
// this is to fetch all the events
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const events = await Event.find().sort({ prizepool: -1 });
    return NextResponse.json(
      { success: true, events, message: "Events fetched" },
      { status: 200 }
    );
  } catch (error) {
    const response = NextResponse.json(
      { error: "Error while getting the events" },
      { status: 500 }
    );
  }
}
