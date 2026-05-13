import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json([{ Title: "Key Error", Script: "Check Vercel Dashboard for GEMINI_API_KEY" }]);
    }

    // We are using a simple string here to avoid syntax errors
    const systemPrompt = "Act as a viral TikTok strategist. Generate 4 unique content ideas about AI Automation. Return ONLY a JSON array with 'Title', 'Script', 'Caption', and 'Hashtags' keys.";

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
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return NextResponse.json(JSON.parse(cleanJson));
  } catch (error) {
    return NextResponse.json([{ Title: "Error", Script: "Server failed to parse response" }], { status: 500 });
  }
}