import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { Database } from '@/types/supabase'

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json()
    const { creatorId, niche, targetCountry } = body

    // Validate required fields
    if (!creatorId || !niche || !targetCountry) {
      return NextResponse.json(
        { error: 'Missing required fields: creatorId, niche, and targetCountry' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Get user session from headers (set by middleware)
    const userId = req.headers.get('x-user-id')
    const userEmail = req.headers.get('x-user-email')

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Development mode: Skip subscription check
    // TODO: Re-enable subscription check in production

    // Generate mock content ideas
    const contentIdeas = [
      {
        title: "Morning Routine Secrets",
        caption: "POV: You wake up and choose the perfect outfit for your content aesthetic ✨ #morningroutine #outfitinspo",
        hashtags: ["#morningroutine", "#outfitinspo", "#grwm", "#fyp", "#aesthetic"],
        estimatedReach: "45K-62K"
      },
      {
        title: "Day in My Life as NYC Creator",
        caption: "From coffee runs to rooftop meetings 🏙️‍♂️ Follow along as I create content in the city that never sleeps 🗽 #nyccreator #citylife #contentcreator",
        hashtags: ["#nyccreator", "#citylife", "#contentcreator", "#newyork", "#nyc", "#viral"],
        estimatedReach: "38K-51K"
      },
      {
        title: "Behind the Scenes: Brand Deal Process",
        caption: "How I turned my passion into a paycheck 💰🤫 Brand deals, creator economy, and the business of being you 📈 #branddeal #creatoreconomy #monetization",
        hashtags: ["#branddeal", "#creatoreconomy", "#monetization", "#business", "#creatorjourney"],
        estimatedReach: "52K-68K"
      },
      {
        title: "Target Country Content Strategy",
        caption: `Creating content specifically for ${targetCountry} audience 🌍 Localized content that resonates with cultural trends and preferences #localcontent #${targetCountry.toLowerCase()}creator`,
        hashtags: [`#${targetCountry.toLowerCase()}creator`, "#localcontent", "#cultural", "#targeted"],
        estimatedReach: "41K-59K"
      },
      {
        title: "Niche Domination Strategy",
        caption: `How to become THE go-to ${niche} creator 🎯 Specialized content strategies that set you apart from the competition #${niche} #nichedominance #expert`,
        hashtags: [`#${niche}`, "#nichedominance", "#expert", "#specialized"],
        estimatedReach: "48K-73K"
      }
    ]

    return NextResponse.json({
      success: true,
      data: {
        creatorId,
        niche,
        targetCountry,
        contentIdeas
      }
    })

  } catch (error) {
    console.error('Content generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content ideas' },
      { status: 500 }
    )
  }
}
