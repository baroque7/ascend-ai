import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json([{ Title: "Key Error", Script: "Check Vercel Dashboard for GEMINI_API_KEY" }]);
    }

    const systemPrompt = "Return ONLY a raw JSON array. Do not include markdown code blocks, backticks, or any introductory text. Start with [ and end with ].";

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }]
        })
      }
    );

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const match = cleanedText.match(/\[([\s\S]*)\]$/m);
      if (!match) {
        return NextResponse.json([{ Title: "Error", Script: "No JSON array found in AI response" }], { status: 500 });
      }

      const jsonString = cleanedText.slice(cleanedText.indexOf('['), cleanedText.lastIndexOf(']') + 1);
      return NextResponse.json(JSON.parse(jsonString));
    } catch (parseError) {
      return NextResponse.json([{ Title: "Error", Script: "Server failed to parse response" }], { status: 500 });
    }
  } catch (error) {
    return NextResponse.json([{ Title: "Error", Script: "Server failed to parse response" }], { status: 500 });
  }
}