import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export async function GET() {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = "Return a JSON array of 5 viral TikTok ideas for a US audience. Each must have: Title, Hook, Script, Caption, Hashtags.";

    const result = await model.generateContent(prompt);
    return NextResponse.json(JSON.parse(result.response.text()));
  } catch (e) {
    return NextResponse.json([{ Title: "AI is loading...", Script: "Check keys" }]);
  }
}