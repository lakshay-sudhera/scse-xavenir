import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import ContactUsModel from "@/models/contactUsModel";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { name, email, number, content } = await req.json();

    if (!name || !email || !number || !content) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    // Save to MongoDB
    const newContact = new ContactUsModel({
      name,
      email,
      number,
      content,
    });
    await newContact.save();

    return NextResponse.json(
      { message: "Query saved successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error occured:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
