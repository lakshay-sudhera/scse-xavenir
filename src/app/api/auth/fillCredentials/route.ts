import { connectDB } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import Eauth from "@/models/eAuthModel";
import bcrypt from "bcryptjs";

// Helper to generate a random 7-character alphanumeric ID prefixed with "USR-"
function generateUserID(req: NextRequest): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 7; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SCSE-${id}`;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    // Retrieve the eAuthToken cookie
    const eAuthTokenCookie = req.cookies.get("eAuthToken");

    if (!eAuthTokenCookie) {
      const response = NextResponse.json(
        { error: "Authentication token missing"},
        { status: 401 }
      );
      return response;
    }

    const eAuthToken = eAuthTokenCookie.value;
    // Verify the eAuth token using JWT
    let decoded: any;
    try {
      decoded = await jwt.verify(eAuthToken, process.env.JWT_SECRET!);
    } catch (err: any) {
      const response = NextResponse.json(
        { error: "Invalid or expired authentication token",status: 401},
        { status: 401 }
      );
      response.cookies.delete("eAuthToken");
      return response;
    }

    const tokenEmail: string = decoded.email;
    if (!tokenEmail) {
      const response = NextResponse.json(
        { error: "Invalid token payload" ,status: 401},
        { status: 401 }
      );
      response.cookies.delete("eAuthToken");
      return response;
    }

    const eAuthRecord = await Eauth.findOne({ email: tokenEmail });
    if (!eAuthRecord) {
      const response = NextResponse.json(
        { error: "Authentication record not found" ,status: 401},
        { status: 401 }
      );
      response.cookies.delete("eAuthToken");
      return response;
    }

    if (eAuthRecord.token !== decoded.token) {
      const response = NextResponse.json(
        { error: "Token mismatch" ,status: 401},
        { status: 401 }
      );
      response.cookies.delete("eAuthToken");
      return response;
    }

    const { email, fullName, password, collegeName } = await req.json();
    console.log("email:", email);
    if (email !== tokenEmail) {
      return NextResponse.json(
        { error: "Email mismatch",status: 401 },
        { status: 401 }
      );
    }
    const user = await User.findOne({ email: email });
    if (user) {
      const response = NextResponse.json(
        { error: "User already exists" ,status: 410},
        { status: 410 }
      );
      response.cookies.delete("eAuthToken");
      return response;
    }

    const isNitian = email.endsWith("@nitjsr.ac.in");
    const hashedPassword = await bcrypt.hash(password,10);
    //change for PG,phd ,masters,etc
    const isFromCse =
  /^[0-9]{4}(?:ugcs|pgcsca|rscs|rsca)[0-9]{3}@nitjsr\.ac\.in$|^[0-9]{4}(?:pgcscs|pgcsds|pgcsis)[0-9]{2}@nitjsr\.ac\.in$/i.test(
    email
  );

    const userID = generateUserID(req);
    const newUser = new User({
      email,
      userID,
      fullName,
      password:hashedPassword,
      role: "user",
      collegeName,
      isNitian,
      isFromCse,
      isPrime: false,
      b1: false,
      b2: false,
      x: false
    });
    await newUser.save();

    // Delete the temporary Eauth record and remove its cookie
    await Eauth.deleteOne({ email: tokenEmail });

    const logtokPayload = {
      userID,
      email,
      fullName,
    };

    const logtok = await jwt.sign(logtokPayload, process.env.JWT_SECRET!, {
      expiresIn: "60d",
    });
    // Set the logtok as a cookie and remove the eAuthToken cookie
    const response = NextResponse.json(
      {
        message: "User registered successfully",status:200
      },
      { status: 200 }
    );
    response.cookies.set("logtok", logtok, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 24 * 60 * 60, // 7 days in seconds
    });
    response.cookies.delete("eAuthToken");
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
