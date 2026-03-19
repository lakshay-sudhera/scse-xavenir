import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connectDB } from "@/dbConfig/dbConfig";
// admin page
// to make boolean true for students who get their hoodies
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userID } = await req.json();
    const user = await User.findById(userID);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  
    if (!user.isPrime) {
      return NextResponse.json(
        { message: "Only prime users allowed" },
        { status: 403 }
      );
    }
  
    if (user.b1) {
      return NextResponse.json(
        { message: "Already collected" },
        { status: 400 }
      );
    }
    user.b1 = true;
    await user.save()
    return NextResponse.json({ message: "Goodies collected sucessfully" });
  } catch (error) {
    console.error("Error in checking goodies:", error);
    return NextResponse.json(
      { error: "Internal Server Error", status: 500 },
      { status: 500 }
    );
  }
}