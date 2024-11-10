import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey!);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Write a script to generate 30 seconds video on topic :Interesting historical story along with AI image prompt in Realistic format for each scene and give me result in JSON format with imagePrompt and ContextText as field, No Plain text",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n[\n  {\n    "imagePrompt": "A bustling medieval marketplace, people in colorful clothes haggling over goods, with a large, imposing cathedral in the background. Realistic style.",\n    "contextText": "In the heart of 14th century England, a young woman named Joan of Arc lived a simple life. But she was about to embark on a journey that would change the course of history."\n  },\n  {\n    "imagePrompt": "Joan of Arc, a young woman with determined eyes, dressed in simple peasant clothing, holding a sword. Realistic style.",\n    "contextText": "Joan claimed to have heard voices, divine visions that told her to lead the French army against the English."\n  },\n  {\n    "imagePrompt": "A medieval battlefield, smoke and dust filling the air, soldiers fighting fiercely, Joan of Arc in the midst of the battle, leading the French troops. Realistic style.",\n    "contextText": "Despite her lack of military experience, Joan inspired the French troops, leading them to victory at Orleans."\n  },\n  {\n    "imagePrompt": "A coronation ceremony, a young king kneeling before a bishop, receiving a crown. Joan of Arc stands nearby, her face showing pride and determination. Realistic style.",\n    "contextText": "Joan\'s bravery and leadership helped turn the tide of the war, leading to the coronation of Charles VII as King of France."\n  },\n  {\n    "imagePrompt": "A medieval prison cell, Joan of Arc chained and alone, her face filled with sadness and despair. Realistic style.",\n    "contextText": "Unfortunately, Joan was captured by the Burgundians and handed over to the English, who put her on trial for heresy."\n  },\n  {\n    "imagePrompt": "A medieval courtroom, Joan of Arc standing before a group of judges, her face resolute, but her eyes filled with fear. Realistic style.",\n    "contextText": "Despite her strong convictions, Joan was condemned and burned at the stake in 1431."\n  },\n  {\n    "imagePrompt": "A statue of Joan of Arc, standing tall and proud, a symbol of strength and courage. Realistic style.",\n    "contextText": "Though Joan of Arc\'s life was tragically cut short, her legacy lives on as a symbol of faith, courage, and the power of one person to change the world."\n  }\n]\n```\n\nThis JSON data provides a structure for a 30-second video with 7 scenes, each with an AI image prompt for a realistic image and a brief context text. \n\n**Note:** The script is designed for a quick, visual storytelling format. You might want to adjust the content based on the specific duration and style of your video. \n',
        },
      ],
    },
  ],
});
