import { NextResponse } from 'next/server'

const TOPICS = [
  "faceless AI automation accounts",
  "passive income with AI tools",
  "how AI is replacing 9-5 jobs",
  "making money online with no followers",
  "US side hustles using AI in 2025",
]

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json([{ Title: "Setup Needed", Script: "Add your GEMINI_API_KEY in Vercel.", Caption: "", Hashtags: "" }])
    }

    const randomTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)]

    const prompt = You are a viral Instagram content strategist for US audiences.

Generate exactly 4 unique content ideas about: "${randomTopic}"

Return ONLY this JSON array with no extra text, no markdown, no backticks:
[
  {
    "Title": "Hook title here",
    "Script": "Full caption script here",
    "Caption": "Short punchy caption under 150 characters",
    "Hashtags": "#hashtag1 #hashtag2 #hashtag3"
  }
]

    const response = await fetch(
      https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey},
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.9, maxOutputTokens: 2000 }
        })
      }
    )

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const clean = text.replace(/`json/g, '').replace(/```/g, '').trim()
    const parsed = JSON.parse(clean)
    return NextResponse.json(parsed)

  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json([{ Title: "Something went wrong", Script: "Refresh for new ideas.", Caption: "", Hashtags: "" }])
  }
}