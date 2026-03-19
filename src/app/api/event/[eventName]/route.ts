import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import Event from "@/models/eventModel";
export const dynamic = "force-dynamic";
// this is to get details of particular event
export async function GET(
  request: NextRequest,
  { params }: { params: { eventName: string } }
) {
  try {
    await connectDB();

    const eventName = decodeURIComponent(params.eventName);

    const event = await Event.findOne({ name: eventName });

    if (!event) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({event}, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}