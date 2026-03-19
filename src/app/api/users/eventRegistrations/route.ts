import { connectDB } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import EventRegistration from "@/models/eventRegistrationModel";

// this route is to get all events registered by a user
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userID } = await req.json();

    const data = await EventRegistration.find({ members: userID });

    return NextResponse.json(
      { message: "Here are the events", data: data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Error while getting the list of events" },
      { status: 500 }
    );
  }
}
