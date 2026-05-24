'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'

const LANGUAGES = [
  'English', 'Spanish', 'French', 'Portuguese', 'Arabic',
  'Italian', 'German', 'Turkish', 'Hindi', 'Indonesian',
]

// Steps: 0=welcome, 1=language, 2=handle, 3=processing
const SETUP_STEPS = [
  { id: 'welcome', emoji: '👋', title: 'Welcome to GramScaling', desc: "Let's build your personalized US growth strategy." },
  { id: 'language', emoji: '🌍', title: 'What language do you speak?', desc: "Scripts in your language. Captions always in English." },
  { id: 'handle', emoji: '📸', title: 'Your Instagram handle', desc: "Enter it once — we'll analyze your profile automatically." },
  { id: 'processing', emoji: '⚡', title: 'Analyzing your profile', desc: "Building your personalized brand strategy…" },
]

type ProcessStatus = 'idle' | 'saving' | 'scraping' | 'storing' | 'done' | 'error'

export default function Onboarding() {
  const { user, supabase } = useAuth()

  const [step, setStep] = useState(0)
  const [language, setLanguage] = useState('English')
  const [handle, setHandle] = useState('')
  const [status, setStatus] = useState<ProcessStatus>('idle')
  const [statusMsg, setStatusMsg] = useState('')
  const [scrapeError, setScrapeError] = useState('')

  const current = SETUP_STEPS[step]

  const canNext =
    step === 0 ? true :
    step === 1 ? language !== '' :
    step === 2 ? handle.trim().length > 0 : false

  async function handleNext() {
    if (step < 2) { setStep(s => s + 1); return }
    // step === 2 → go to processing
    setStep(3)
    await runSetupPipeline()
  }

  async function runSetupPipeline() {
    const cleanHandle = handle.replace('@', '').trim().toLowerCase()
    setScrapeError('')

    try {
      // ── Step 1: Save identity immediately ─────────────────────
      setStatus('saving')
      setStatusMsg('Saving your profile…')

      await supabase.auth.updateUser({
        data: { language, instagram_handle: cleanHandle },
      })

      if (user) {
        await supabase.from('users').upsert({
          id: user.id,
          instagram_username: cleanHandle,
          language,
        }, { onConflict: 'id' })
      }

      // ── Step 2: Scrape Instagram + Gemini analysis ─────────────
      setStatus('scraping')
      setStatusMsg('Fetching your Instagram data…')

      let analysis: Record<string, any> | null = null
      let scrapedData: Record<string, any> = {}
      let engagementRate = 0
      let hikerSuccess = false

      try {
        const res = await fetch('/api/scrape', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: cleanHandle, userId: user?.id }),
        })
        const json = await res.json()

        if (json.error) {
          console.warn('[onboarding] Scrape returned error:', json.error)
          setScrapeError('Instagram analysis had an issue — basic profile saved.')
        } else {
          analysis = json.analysis || null
          scrapedData = json.scrapedData || {}
          engagementRate = json.engagementRate || 0
          hikerSuccess = json.hikerSuccess || false
          console.log('[onboarding] Scrape success — hikerAPI:', hikerSuccess, '| brandScore:', analysis?.brandScore, '| followers:', scrapedData.follower_count, '| full_name:', scrapedData.full_name)

          // Persist HikerAPI full_name to auth metadata so dashboard greeting has it immediately
          if (scrapedData.full_name && user) {
            await supabase.auth.updateUser({ data: { hiker_full_name: scrapedData.full_name } })
          }
        }
      } catch (fetchErr) {
        console.warn('[onboarding] Scrape fetch failed:', fetchErr)
        setScrapeError('Could not reach analysis server — basic profile saved.')
      }

      // ── Step 3: Client-side Supabase write (works via RLS) ─────
      if (analysis && user) {
        setStatus('storing')
        setStatusMsg('Saving your brand analysis…')

        const { error: usersErr } = await supabase.from('users').upsert({
          id: user.id,
          instagram_username: cleanHandle,
          language,
          last_scraped_at: new Date().toISOString(),
        }, { onConflict: 'id' })
        if (usersErr) console.error('[onboarding] users upsert error:', usersErr)

        const { error: profilesErr } = await supabase.from('profiles').upsert({
          user_id: user.id,
          brand_score: Math.round(analysis.brandScore || 0),
          niche: analysis.niche || '',
          engagement_rate: engagementRate,
          follower_count: scrapedData.follower_count || 0,
          following_count: scrapedData.following_count || 0,
          brand_identity: analysis.brandIdentity || '',
          brand_personality: analysis.brandPersonality || '',
          content_pillars: analysis.contentPillars || [],
          what_makes_unique: analysis.whatMakesThemUnique || '',
          current_problems: analysis.currentProblems || [],
          profile_score: Math.round(analysis.profileScore || 0),
          best_posting_times: analysis.bestPostingTimes || [],
          top_content_type: analysis.topPerformingContentType || '',
          format_fatigue: analysis.formatFatigue || false,
          format_fatigue_warning: analysis.formatFatigueWarning || '',
          us_growth_strategy: analysis.usGrowthStrategy || '',
          hispanic_to_us_shift: analysis.hispanicToUSShift || '',
          filming_tips: analysis.filmingEnvironmentTips || '',
          hashtag_strategy: analysis.hashtagStrategy || '',
          content_variations: analysis.contentVariations || [],
          weekly_plan: analysis.weeklyPlan || '',
          bio_rewrite: analysis.bioRewrite || '',
          audience_type: analysis.audienceType || '',
          is_hispanic_audience: analysis.isHispanicAudience || false,
          posting_frequency: analysis.postingFrequency || '',
          raw_scraped_data: scrapedData,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })
        if (profilesErr) console.error('[onboarding] profiles upsert error:', profilesErr)
        else console.log('[onboarding] All data saved to Supabase — followers:', scrapedData.follower_count, '| niche:', analysis.niche)
      }

      setStatus('done')
      setStatusMsg('All done! Taking you to your dashboard…')
      // Use href for reliable redirect from within async pipeline
      setTimeout(() => { window.location.href = '/dashboard' }, 1200)

    } catch (err: any) {
      console.error('[onboarding] Pipeline error:', err)
      setStatus('error')
      setStatusMsg('Something went wrong — redirecting to dashboard.')
      setTimeout(() => { window.location.href = '/dashboard' }, 2000)
    }
  }

  const statusSteps: { key: ProcessStatus; label: string }[] = [
    { key: 'saving', label: 'Profile saved' },
    { key: 'scraping', label: 'Instagram analyzed' },
    { key: 'storing', label: 'Brand data stored' },
    { key: 'done', label: 'Ready' },
  ]

  return (
    <div style={{ background: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '24px', maxWidth: 480, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <span style={{ color: '#FFD700', fontWeight: 900, fontSize: 18 }}>GramScaling</span>
        {step < 3 && (
          <button onClick={() => { window.location.href = '/dashboard' }} style={{ background: 'none', border: 'none', color: '#333', fontSize: 13, cursor: 'pointer', padding: 0 }}>
            Skip
          </button>
        )}
      </div>

      {/* Progress bar — only for steps 0-2 */}
      {step < 3 && (
        <div style={{ height: 3, background: '#111', borderRadius: 2, marginBottom: 36, overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', background: '#FFD700', borderRadius: 2 }}
            animate={{ width: `${((step + 1) / 3) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: step === 3 ? 0 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: step === 3 ? 0 : -30 }}
            transition={{ duration: 0.28 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ textAlign: 'center', marginBottom: step === 3 ? 48 : 32 }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>{current.emoji}</div>
              <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 900, marginBottom: 10, letterSpacing: '-0.5px', lineHeight: 1.2 }}>{current.title}</h1>
              <p style={{ color: '#555', fontSize: 14, lineHeight: 1.6 }}>{current.desc}</p>
            </div>

            {/* LANGUAGE — step 1 */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {LANGUAGES.map(l => {
                  const active = language === l
                  return (
                    <motion.button key={l} onClick={() => setLanguage(l)} whileTap={{ scale: 0.98 }}
                      style={{ padding: '14px 18px', background: active ? 'rgba(255,215,0,0.08)' : '#0a0a0a', border: `1px solid ${active ? 'rgba(255,215,0,0.4)' : '#1a1a1a'}`, borderRadius: 12, color: active ? '#FFD700' : '#666', fontSize: 14, fontWeight: active ? 700 : 400, cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {l}
                      {active && <span style={{ fontSize: 16 }}>✓</span>}
                    </motion.button>
                  )
                })}
              </div>
            )}

            {/* HANDLE — step 2 */}
            {step === 2 && (
              <div style={{ marginBottom: 24 }}>
                <input
                  type="text"
                  placeholder="@yourhandle"
                  value={handle}
                  onChange={e => setHandle(e.target.value)}
                  style={{ width: '100%', padding: '16px', background: '#111', border: '1px solid #1a1a1a', borderRadius: 12, color: '#fff', fontSize: 18, boxSizing: 'border-box', outline: 'none', textAlign: 'center', letterSpacing: '0.5px' }}
                  autoCapitalize="none"
                  autoCorrect="off"
                />
                <p style={{ color: '#333', fontSize: 13, textAlign: 'center', marginTop: 10 }}>Your niche is detected automatically from your posts</p>
              </div>
            )}

            {/* PROCESSING — step 3 */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                {status !== 'done' && status !== 'error' && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    style={{ width: 52, height: 52, border: '3px solid #1a1a1a', borderTopColor: '#FFD700', borderRadius: '50%', marginBottom: 28 }}
                  />
                )}
                {status === 'done' && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    style={{ fontSize: 56, marginBottom: 24 }}>
                    🎉
                  </motion.div>
                )}
                {status === 'error' && <div style={{ fontSize: 48, marginBottom: 24 }}>⚠️</div>}

                <motion.p
                  key={statusMsg}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ color: status === 'error' ? '#ff8c42' : status === 'done' ? '#FFD700' : '#ccc', fontSize: 16, fontWeight: 600, textAlign: 'center', lineHeight: 1.5, marginBottom: 8 }}
                >
                  {statusMsg}
                </motion.p>

                {scrapeError && (
                  <p style={{ color: '#666', fontSize: 12, textAlign: 'center', marginBottom: 16 }}>{scrapeError}</p>
                )}

                <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                  {statusSteps.map((item, i) => {
                    const order: ProcessStatus[] = ['saving', 'scraping', 'storing', 'done']
                    const itemIdx = order.indexOf(item.key)
                    const currentIdx = order.indexOf(status)
                    const isDone = currentIdx > itemIdx || status === 'done'
                    const isActive = order[currentIdx] === item.key
                    return (
                      <motion.div key={item.key}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: isDone || isActive ? 1 : 0.25, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: isDone ? 'rgba(255,215,0,0.04)' : '#0a0a0a', border: `1px solid ${isDone ? 'rgba(255,215,0,0.15)' : '#111'}`, borderRadius: 10 }}>
                        <span style={{ fontSize: 14, color: isDone ? '#FFD700' : isActive ? '#fff' : '#222' }}>
                          {isDone ? '✓' : isActive ? '●' : '○'}
                        </span>
                        <span style={{ color: isDone ? '#FFD700' : isActive ? '#fff' : '#333', fontSize: 13, fontWeight: isDone ? 700 : 400 }}>
                          {item.label}
                        </span>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation — only for steps 0-2 */}
      {step < 3 && (
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              style={{ padding: '15px', background: '#111', border: '1px solid #1a1a1a', borderRadius: 50, color: '#666', fontSize: 20, cursor: 'pointer', width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ←
            </button>
          )}
          <motion.button
            onClick={handleNext}
            disabled={!canNext}
            whileTap={{ scale: 0.98 }}
            style={{ flex: 1, padding: '16px', background: canNext ? '#FFD700' : '#1a1a1a', border: 'none', borderRadius: 50, color: canNext ? '#000' : '#333', fontSize: 17, fontWeight: 900, cursor: canNext ? 'pointer' : 'default' }}
          >
            {step === 2 ? 'Analyze My Profile →' : 'Continue →'}
          </motion.button>
        </div>
      )}
    </div>
  )
}
