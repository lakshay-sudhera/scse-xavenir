import { connectDB } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import EventRegistration from "@/models/eventRegistrationModel";

// flow is if non-cse student is making team with cse team , then it must pay team fee
// if other collge student is making team with nit student then other cllg student must be a prime member
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { teamName, members, eventName } = await req.json();

    // 1) Check for missing fields
    if (!teamName || !Array.isArray(members) || !eventName) {
      return NextResponse.json(
        { error: "Missing required fields: teamName, members, or eventName" },
        { status: 400 }
      );
    }

    // logic for unique
    const uniqueMembers = new Set(members);
    if (uniqueMembers.size !== members.length) {
      return NextResponse.json(
        { error: "Duplicate entries in members array" },
        { status: 400 }
      );
    }

    // 2) For each member, ensure user exists
    let allPrime = true;
    let allCSE = true;
    let allNitian = true;

    for (const memberId of members) {
      const user = await User.findOne({ userID: memberId });
      console.log(user);
      let mustBePrime = false;
      if (!user) {
        return NextResponse.json(
          { error: `Member not found in DB: ${memberId}` },
          { status: 404 }
        );
      }
      if(user.isNitian && user.isFromCse && !user.isPrime){
        return NextResponse.json(
          { error: "All members are not Prime , register as prime" },
          { status: 400 }
        );
      }
      if (!user.isPrime) {
        allPrime = false;
      }
      if (!user.isFromCse) {
        allCSE = false;
      }
      if (!user.isNitian) {
        allNitian = false;
      }
    }
    // if a person is from other branch than cse, then it must be non-prime
    // below case:if non cse and cse are present then cse must be prime but still pay team fee bcz of non cse
    if (!allPrime && allNitian && !allCSE) {
      return NextResponse.json(
        { error: "All members are not Prime , pay for registration below" },
        { status: 420 }
      );
    }

    if (!allPrime) {
      return NextResponse.json(
        { error: "All members are not Prime , register as prime" },
        { status: 400 }
      );
    }
    const newRegistration = new EventRegistration({
      teamName,
      eventName,
      members,
      isAllPrime: true,
      razorpay_order_id: "no_need",
      razorpay_payment_id: "no_need",
      razorpay_signature: "no_need",
    });

    await newRegistration.save();

    return NextResponse.json(
      { success: true, message: "Registration created successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Event Registration Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
