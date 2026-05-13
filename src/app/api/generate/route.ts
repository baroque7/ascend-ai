import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json([{ Title: "Error", Script: "API Key is missing in Vercel settings.", Caption: "Check Keys", Hashtags: "#error" }]);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Generate 3 viral TikTok hook ideas for a US audience about faceless AI automation. Return ONLY a JSON array with 'Title', 'Script', 'Caption', and 'Hashtags' keys.";
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // This was the broken line—it's clean now:
    const cleanJson = text.replace(/```json|
```/g, "");
    return NextResponse.json(JSON.parse(cleanJson));
  } catch (error) {
    return NextResponse.json([{ Title: "AI Error", Script: "The AI is having trouble connecting.", Caption: "Connection Issue", Hashtags: "#debug" }]);
  }
}