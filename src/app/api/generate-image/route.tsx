import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { writeFile } from "node:fs/promises";

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
      // Instead of writing the file, just log the URL to the console
      const imageFile = `/output_${index}.png`;
      imageFiles.push(imageFile);

      console.log(`Image URL: ${imageFile}`);
    }


    return NextResponse.json({ 'result': imageFiles })
  } catch (e) {
    console.error("Error in image generation:", e);
    return NextResponse.json({ 'error': e })
  }
}