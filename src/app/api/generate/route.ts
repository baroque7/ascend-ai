import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 1. Using the new name you set in Vercel
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json([{ Title: "Error", Script: "Key missing in Vercel settings." }]);
    }

    const systemPrompt = "Generate 3 viral TikTok hook ideas for a US audience about faceless AI automation. Return ONLY a JSON array with 'Title', 'Script', 'Caption', and 'Hashtags' keys.";

    // 2. Direct fetch to Google
    const response = await fetch(
      https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey},
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
    
    // 3. Cleaning the AI response so it's a real list
    const cleanJson = text.replace(/`json/g, '').replace(/```/g, '').trim();
    
    return NextResponse.json(JSON.parse(cleanJson));
  } catch (error) {
    console.error('Gemini error:', error);
    return NextResponse.json([{ Title: "Error", Script: "AI request failed to parse." }], { status: 500 });
  }
}