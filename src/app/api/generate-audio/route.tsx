import { NextRequest, NextResponse } from "next/server"
import textToSpeech, { protos } from '@google-cloud/text-to-speech'
import fs from 'fs';
import util from 'util';

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
    // Write the binary audio content to a local file
    if (response.audioContent) {
      const buffer = Buffer.from(response.audioContent);

      // Write the binary audio content to a local file
      const writeFile = util.promisify(fs.writeFile);
      await writeFile('output.mp3', buffer, 'binary');
      console.log('Audio content written to file: output.mp3');
    }
    return NextResponse.json({ Result: 'Success' })
  } catch (error) {
    console.error('Error during text-to-speech synthesis:', error);
    return NextResponse.json({ error: 'Failed to synthesize speech' }, { status: 500 });
  }
} 