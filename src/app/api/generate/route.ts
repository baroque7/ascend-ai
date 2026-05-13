import { NextResponse } from 'next/server'

const TOPICS = [
  "faceless AI automation accounts",
  "passive income with AI tools",
  "how AI is replacing 9-5 jobs",
  "making money online with no followers",
  "US side hustles using AI in 2025",
];

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        [{ Title: "Setup Needed", Script: "Add your GEMINI_API_KEY in Vercel environment settings.", Caption: "", Hashtags: "" }]
      );
    }

    const randomTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)];

    const systemPrompt = You are a viral TikTok content strategist who knows exactly what hits on the US For You Page (FYP).

Generate exactly 4 unique TikTok content ideas about: "${randomTopic}"

Rules:
- Each hook must feel urgent, relatable, or shocking to a US audience
- Scripts should be 60 seconds when read aloud (around 130-150 words)
- Captions should be punchy, under 150 characters
- Include 5-8 trending US hashtags per idea
- Make all 4 ideas feel completely different from each other

Return ONLY a valid JSON array. No extra text, no markdown, no backticks. Example format:
[
  {
    "Title": "Hook title here",
    "Script": "Full 60 second script here...",
    "Caption": "Short punchy caption here",
    "Hashtags": "#hashtag1 #hashtag2 #hashtag3"
  }
];

    const response = await fetch(
      https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey},
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 2000,
          }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', errText);
      return NextResponse.json(
        [{ Title: "API Error", Script: "Gemini rejected the request. Check your API key is active.", Caption: "", Hashtags: "" }],
        { status: 500 }
      );
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const cleanJson = rawText
      .replace(/
      .replace(/
/g, '')
      .trim();

    const parsed = JSON.parse(cleanJson);
    return NextResponse.json(parsed);

  } catch (error) {
    console.error('Generate route error:', error);
    return NextResponse.json(
      [{ Title: "Something went wrong", Script: "Refresh for new ideas — the AI had a hiccup.", Caption: "", Hashtags: "" }],
      { status: 500 }
    );
  }
}