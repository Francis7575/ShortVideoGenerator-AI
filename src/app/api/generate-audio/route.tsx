import { NextRequest, NextResponse } from "next/server";
import textToSpeech, { protos } from '@google-cloud/text-to-speech';
import { storage } from "@/config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const client = new textToSpeech.TextToSpeechClient({
  apiKey: process.env.GOOGLE_API_KEY
});

// Timeout helper function
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Operation timed out")), ms)
  );
  return Promise.race([promise, timeout]);
}

export async function POST(req: NextRequest) {
  try {
    const { text, id } = await req.json();

    // Text-to-Speech Request
    const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
      input: { text },
      voice: {
        languageCode: 'en-US',
        ssmlGender: protos.google.cloud.texttospeech.v1.SsmlVoiceGender.FEMALE,
      },
      audioConfig: { audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3 },
    };

    const [response] = await withTimeout(client.synthesizeSpeech(request), 20000); // 8-second timeout

    if (response.audioContent) {
      // Add timeout to file upload
      const downloadUrl = await uploadAndRetrieveURL(Buffer.from(response.audioContent), id);

      return NextResponse.json({ result: downloadUrl });
    } else {
      throw new Error("Failed to generate audio content");
    }
  } catch (error) {
    let errorMessage = 'Unknown error occurred';
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message === "Operation timed out") {
        statusCode = 504; // Gateway Timeout
      }
    }

    console.error('Error during text-to-speech synthesis:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

const uploadAndRetrieveURL = async (audioContent: Buffer, id: string) => {
  const storageRef = ref(storage, `ai-short-video-files/${id}.mp3`);

  // Upload the audio content and get the URL
  await withTimeout(uploadBytes(storageRef, audioContent, { contentType: 'audio/mp3' }), 7000);

  const urlPromise = getDownloadURL(storageRef);
  const downloadUrl = await withTimeout(urlPromise, 5000);

  return downloadUrl;
};
