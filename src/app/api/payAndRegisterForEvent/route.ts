import { connectDB } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import PendingEventRegistrations from "@/models/pendingEventPaymentModel";


// get the current user id from the token, if token is valid and user exists, else return null
async function getCurrentUserIdFromToken(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get("logtok")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (!decoded?.email) return null;

    const user = await User.findOne({ email: decoded.email }).select("userID").lean();
    return user?.userID ?? null;
  } catch {
    return null;
  }
}

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
    if (!eventName || !teamName || !paymentProof || !transactionId1) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Normalize members array: ensure it's an array of non-empty strings
    const normalizedMembers = Array.isArray(members)
      ? members.filter(
          (member) => typeof member === "string" && member.trim() !== ""
        )
      : [];

    if (normalizedMembers.length === 0) {
      return NextResponse.json(
        { error: "Members array must contain at least one member" },
        { status: 400 }
      );
    }
// Ensure the creator is included in the members list, and remove duplicates
    const currentUserId = await getCurrentUserIdFromToken(req);
    const uniqueOtherMembers = normalizedMembers.filter(
      (member, index, array) =>
        member !== currentUserId && array.indexOf(member) === index
    );

    const finalMembers = currentUserId
      ? [currentUserId, ...uniqueOtherMembers]
      : normalizedMembers.filter(
          (member, index, array) => array.indexOf(member) === index
        );

    const newRegistration = await PendingEventRegistrations.create({
      eventName,
      teamName,
      paymentProof,
      members: finalMembers,
      transactionId1,
      transactionId2,
      transactionId3,
      isPending: true,
      isSpam: false,
    });

    return NextResponse.json(
      { message: "Registration successful", newRegistration },
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
