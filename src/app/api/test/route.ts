import { NextResponse } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";

export async function GET() {

  await connectDB();

  return NextResponse.json({
    message: "Database connected successfully"
  });

}