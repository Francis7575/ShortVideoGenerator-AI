import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { readFile, writeFile } from "node:fs/promises";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "@/config/firebase";

export async function POST(req: NextRequest) {
  try {
    const { prompts } = await req.json()

    const replicate = new Replicate({
      auth: process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN
    });

    const input = {
      prompt: prompts,
      height: 1280,
      width: 1024,
      num_outputs: 1
    };

    const output = await replicate.run("bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637", { input });
    console.log("Replicate output:", output);

    const imageFiles: string[] = [];

    // Ensure output is an array or object with valid image data
    for (const [index, item] of Object.entries(output)) {
      await writeFile(`output_${index}.png`, item);
      const localFilePath = `output_${index}.png`;

      // Convert the saved file to base64
      const base64Image = await convertImageFileToBase64(localFilePath);

      // Upload the base64 image to Firebase
      const fileName = `${Date.now()}_output_${index}.png`;
      const storageRef = ref(storage, `ai-short-video-files/${fileName}`);
      await uploadString(storageRef, base64Image, "data_url");

      // Get the Firebase download URL and add to the array
      const downloadUrl = await getDownloadURL(storageRef);
      imageFiles.push(downloadUrl);
      console.log(`Image uploaded to Firebase: ${downloadUrl}`);
    }

    return NextResponse.json({ 'result': imageFiles })
  } catch (e) {
    console.error("Error in image generation:", e);
    return NextResponse.json({ 'error': e })
  }
}

async function convertImageFileToBase64(filePath: string) {
  try {
    const fileData = await readFile(filePath);
    return `data:image/png;base64,${fileData.toString("base64")}`;
  } catch (error) {
    console.error("Error reading or converting file to base64:", error);
    throw error;
  }
}