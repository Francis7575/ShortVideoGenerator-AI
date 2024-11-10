import { chatSession } from "@/config/AiModel";
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()
    console.log(prompt);

    const result = await chatSession.sendMessage(prompt)
    console.log(result.response.text());

    return NextResponse.json({ 'result': JSON.parse(result.response.text()) })
  } catch (e) {
    return NextResponse.json({ 'Error': e })
  }
}