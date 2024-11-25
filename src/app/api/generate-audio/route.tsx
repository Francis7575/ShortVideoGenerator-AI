import { NextRequest, NextResponse } from "next/server"
import textToSpeech, { protos } from '@google-cloud/text-to-speech'
import { storage } from "@/config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

const client = new textToSpeech.TextToSpeechClient({
  apiKey: process.env.GOOGLE_API_KEY
})

export async function POST(req: NextRequest) {
  try {
    const { text, id } = await req.json();
    const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
      input: { text },
      voice: {
        languageCode: 'en-US',
        ssmlGender: protos.google.cloud.texttospeech.v1.SsmlVoiceGender.FEMALE,
      },
      audioConfig: { audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3 },
    };

    const [response] = await client.synthesizeSpeech(request);

    if (response.audioContent) {
      const storageRef = ref(storage, 'ai-short-video-files/' + id + '.mp3')
      await uploadBytes(storageRef, Buffer.from(response.audioContent), { contentType: 'audio/mp3' })
      const downloadUrl = await getDownloadURL(storageRef)
      return NextResponse.json({ result: downloadUrl })
    } else {
      throw new Error("Failed to generate audio content");
    }
  } catch (error) {
    console.error('Error during text-to-speech synthesis:', error);
    return NextResponse.json({ error: 'Failed to synthesize speech' }, { status: 500 });
  }
} 