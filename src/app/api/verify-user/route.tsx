import { db } from "@/config/db";
import { Users } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { user } = await req.json();
  try {
    // if user already exist
    const userInfo = await db.select().from(Users)
      .where(eq(Users.email, user.primaryEmailAddress.emailAddress))

    // if not exist add new user to db
    if (userInfo.length == 0) {
      const saveResult = await db.insert(Users)
        .values({
          name: user?.fullName,
          email: user?.primaryEmailAddress.emailAddress,
          imageUrl: user?.imageUrl,
          credits: user?.credits
        }).returning({
          id: Users.id,        
          name: Users.name,
          email: Users.email,
          imageUrl: Users.imageUrl,
          credits: Users.credits 
        });
      return NextResponse.json({ 'result': saveResult[0] })
    }
    return NextResponse.json({ 'result': userInfo[0] })
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json({ error: e })
  }
}