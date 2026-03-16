import { NextResponse } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/User";

export async function GET() {

    await connectDB();

    const users = await User.find();

    return NextResponse.json(users);
}

export async function POST() {

    await connectDB();

    const newUser = await User.create({
        name: "Ayush",
        email: "ayush@test.com",
        password: "123456"
    });

    return NextResponse.json(newUser);
}