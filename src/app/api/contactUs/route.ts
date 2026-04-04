import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import ContactUsModel from "@/models/contactUsModel";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { name, email, number, content } = await req.json();

    // Required fields validation
    if (!name || !email || !number || !content) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Email Regex Validation
    const emailRegex =
      /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Phone Number Validation (10 digits only)
    const phoneRegex = /^\d{10}$/;

    if (!phoneRegex.test(number)) {
      return NextResponse.json(
        { error: "Phone number must be of 10 digits" },
        { status: 400 }
      );
    }

    // Message length validation (optional but recommended)
    if (content.trim().length < 5) {
      return NextResponse.json(
        { error: "Message must be at least 5 characters" },
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