import { NextRequest, NextResponse } from 'next/server'

const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { userProfile } = await request.json()

    if (!GEMINI_KEY) return NextResponse.json({ error: 'AI not configured' }, { status: 500 })

    const profile = userProfile || {}

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a brand strategist and Instagram growth expert who has built audiences for models going from zero to hundreds of thousands of American followers.
Creator data: ${JSON.stringify(profile)}
Build their complete US growth strategy. Return ONLY valid JSON with no markdown no backticks:
{
"brandStatement": "one powerful sentence that defines who they are and why American men will follow them",
"uniqueAngle": "what makes them completely different from every other model in their niche be specific",
"brandVoice": "exactly how they should speak and present themselves in every post",
"visualIdentity": "specific visual style colors aesthetic vibe they should maintain consistently",
"contentPillars": [
{"pillar": "pillar name", "description": "what content falls under this", "percentage": "how much of feed should be this"},
{"pillar": "pillar name", "description": "description", "percentage": "percentage"},
{"pillar": "pillar name", "description": "description", "percentage": "percentage"}
],
"audienceShiftPlan": "step by step plan to shift from current audience to American audience over 30 days",
"formatFatigueAlert": "specific warning if overusing any content format with exact recommendation",
"top5ContentVariations": ["variation1", "variation2", "variation3", "variation4", "variation5"],
"profileOptimization": {
"bioRewrite": "rewrite their bio to sound like a real American person",
"profilePictureTip": "specific advice on profile picture",
"highlightStrategy": "what story highlights to have and what to put in them"
},
"filmingEnvironment": {
"mustRemove": ["thing to remove 1", "thing to remove 2"],
"mustAdd": ["thing to add 1", "thing to add 2"],
"outfitRecommendations": ["outfit 1", "outfit 2", "outfit 3"],
"lightingSetup": "specific lighting advice"
},
"weeklySchedule": {
"monday": "what to post",
"tuesday": "what to post",
"wednesday": "what to post",
"thursday": "what to post",
"friday": "what to post",
"saturday": "what to post",
"sunday": "what to post"
},
"30dayMilestones": ["week 1 goal", "week 2 goal", "week 3 goal", "week 4 goal"],
"warningSignals": ["sign that strategy is working", "sign that something needs to change"]
}`,
            }],
          }],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                brandStatement: { type: 'STRING' },
                uniqueAngle: { type: 'STRING' },
                brandVoice: { type: 'STRING' },
                visualIdentity: { type: 'STRING' },
                contentPillars: {
                  type: 'ARRAY',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      pillar: { type: 'STRING' },
                      description: { type: 'STRING' },
                      percentage: { type: 'STRING' },
                    },
                  },
                },
                audienceShiftPlan: { type: 'STRING' },
                formatFatigueAlert: { type: 'STRING' },
                top5ContentVariations: { type: 'ARRAY', items: { type: 'STRING' } },
                profileOptimization: {
                  type: 'OBJECT',
                  properties: {
                    bioRewrite: { type: 'STRING' },
                    profilePictureTip: { type: 'STRING' },
                    highlightStrategy: { type: 'STRING' },
                  },
                },
                filmingEnvironment: {
                  type: 'OBJECT',
                  properties: {
                    mustRemove: { type: 'ARRAY', items: { type: 'STRING' } },
                    mustAdd: { type: 'ARRAY', items: { type: 'STRING' } },
                    outfitRecommendations: { type: 'ARRAY', items: { type: 'STRING' } },
                    lightingSetup: { type: 'STRING' },
                  },
                },
                weeklySchedule: {
                  type: 'OBJECT',
                  properties: {
                    monday: { type: 'STRING' },
                    tuesday: { type: 'STRING' },
                    wednesday: { type: 'STRING' },
                    thursday: { type: 'STRING' },
                    friday: { type: 'STRING' },
                    saturday: { type: 'STRING' },
                    sunday: { type: 'STRING' },
                  },
                },
                '30dayMilestones': { type: 'ARRAY', items: { type: 'STRING' } },
                warningSignals: { type: 'ARRAY', items: { type: 'STRING' } },
              },
              required: ['brandStatement', 'uniqueAngle', 'brandVoice', 'contentPillars', 'audienceShiftPlan', 'weeklySchedule'],
            },
            temperature: 0.8,
            maxOutputTokens: 6000,
          },
        }),
      }
    )

    const data = await res.json()
    if (!res.ok) {
      if (res.status === 429) return NextResponse.json({ error: 'AI limit reached. Wait a moment.' }, { status: 429 })
      return NextResponse.json({ error: data.error?.message || 'AI unavailable' }, { status: res.status })
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) return NextResponse.json({ error: 'Empty response' }, { status: 500 })

    return NextResponse.json(JSON.parse(text.trim()))
  } catch (err: any) {
    console.error('Strategy error:', err)
    return NextResponse.json({ error: `Strategy failed: ${err.message}` }, { status: 500 })
  }
}
