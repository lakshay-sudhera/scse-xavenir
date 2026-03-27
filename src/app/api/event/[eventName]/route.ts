 import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import Event from "@/models/eventModel";
export const dynamic = "force-dynamic";
// this is to get details of particular event
export async function GET(
  request: NextRequest,
   { params }: { params: Promise<{ eventName: string }> }
) {
  try {
    await connectDB();

    const { eventName: rawName } = await params;
    const eventName = decodeURIComponent(rawName);
    console.log(eventName);
    const event = await Event.findOne({ name: eventName });

    if (!event) {
      return NextResponse.json(
        { success: false,message: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({success:true,event}, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}