import { NextRequest, NextResponse } from 'next/server'

const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { userProfile } = await request.json()

    if (!GEMINI_KEY) return NextResponse.json({ error: 'AI not configured' }, { status: 500 })

    const profile = userProfile || {}

    const rawData = (profile.raw_scraped_data as any) || {}
    const recentPosts = (rawData.recent_posts || []).slice(0, 8).map((p: any) => ({
      likes: p.likes,
      comments: p.comments,
      type: p.type,
      caption: (p.caption || '').slice(0, 120),
      date: p.date,
    }))

    const specificContext = {
      instagramHandle: profile.instagram_username || rawData.username || '',
      actualBio: rawData.bio || profile.bio || '',
      followerCount: profile.follower_count || rawData.follower_count || 0,
      followingCount: profile.following_count || rawData.following_count || 0,
      engagementRate: profile.engagement_rate || rawData.engagement_rate || 0,
      postingFrequency: profile.posting_frequency || '',
      topContentFormat: profile.top_content_type || '',
      detectedNiche: profile.niche || '',
      contentPillars: Array.isArray(profile.content_pillars) ? profile.content_pillars.join(', ') : '',
      brandPersonality: profile.brand_personality || '',
      audienceType: profile.audience_type || '',
      recentPosts,
      language: profile.language || 'English',
      isVerified: rawData.is_verified || false,
    }

    const prompt = `You are a brand strategist and Instagram growth expert specializing in building US audiences for creators.

CRITICAL RULES — NEVER violate these:
1. NEVER use "she", "her", "they", "the creator", "this model", "this account". Always write directly using "you" and "your".
2. Reference the ACTUAL data below. Never give generic advice that could apply to any account.
3. Every recommendation must cite something specific from their real bio, real posts, or real metrics.
4. If bio is empty or posts are sparse, acknowledge that and give targeted advice based on what IS available.

REAL ACCOUNT DATA:
${JSON.stringify(specificContext, null, 2)}

Based on this SPECIFIC account's actual data, build their complete US growth strategy. Return JSON:`

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
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
