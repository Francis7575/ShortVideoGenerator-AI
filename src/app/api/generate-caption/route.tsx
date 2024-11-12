import { AssemblyAI } from 'assemblyai'
import { NextResponse, NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { audioFile } = await req.json()

    const client = new AssemblyAI({
      apiKey: process.env.NEXT_PUBLIC_ASSEMBLY_API_KEY!
    })

    const file_url = audioFile

    const config = {
      audio_url: file_url
    }

    const transcript = await client.transcripts.transcribe(config)
    console.log(transcript.words)
    return NextResponse.json({ 'result': transcript.words })
  } catch (err) {
    return NextResponse.json({ 'error': err })
  }
}