import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json([{ Title: "Key Error", Script: "Check Vercel Dashboard for GEMINI_API_KEY" }]);
    }

    const systemPrompt = "Return ONLY a raw JSON array. NO introductory text, NO markdown code blocks, and NO backticks.";

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

    try {
      const match = rawText.match(/\[[\s\S]*\]/);
      if (!match) {
        return NextResponse.json([{ Title: "Error", Script: "No JSON array found in AI response. Ensure the model returns raw JSON only." }], { status: 500 });
      }

      return NextResponse.json(JSON.parse(match[0]));
    } catch (parseError) {
      return NextResponse.json([{ Title: "Error", Script: "Server failed to parse AI array response." }], { status: 500 });
    }
  } catch (error) {
    return NextResponse.json([{ Title: "Error", Script: "Server failed to parse response" }], { status: 500 });
  }
}