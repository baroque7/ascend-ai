import { NextResponse } from 'next/server';

const TOPICS = ["Faceless AI Automation", "AI Side Hustles", "TikTok Shop Secrets", "Viral AI Tools"];

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json([{ Title: "Error", Script: "API Key missing in Vercel." }]);
    }

    const randomTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)];

    // FIXED: Added backticks around the prompt and ${} for the variable
    const systemPrompt = You are a viral TikTok content strategist who knows exactly what works for a US audience. Generate exactly 4 unique TikTok content ideas about: "${randomTopic}". Return ONLY a JSON array with 'Title', 'Script', 'Caption', and 'Hashtags' keys. No conversational text.;

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
    const cleanJson = text.replace(/`json/g, '').replace(/```/g, '').trim();
    
    return NextResponse.json(JSON.parse(cleanJson));
  } catch (error) {
    console.error('Gemini error:', error);
    return NextResponse.json([{ Title: "Error", Script: "Failed to generate hooks." }], { status: 500 });
  }
}