import Link from 'next/link'

const features = [
  'Instagram profile analysis (unlimited)',
  'Personalized US market niche',
  'Daily content ideas with full scripts',
  'Captions in your language',
  'Hashtag strategy for US reach',
  'Best posting times (US time zones)',
  'Profile optimization tips',
  'Growth tracking dashboard',
  'US audience targeting strategy',
  'Priority email support',
]

export default function Pricing() {
  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Link href="/" style={{ color: '#FFD700', fontWeight: 900, fontSize: 20, textDecoration: 'none', marginBottom: 48 }}>
        GramScaling
      </Link>

      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ color: '#fff', fontSize: 34, fontWeight: 900, marginBottom: 10, letterSpacing: '-1px' }}>Simple Pricing</h1>
        <p style={{ color: '#555', fontSize: 16 }}>One plan. Everything included. No surprises.</p>
      </div>

      <div style={{ width: '100%', maxWidth: 380, background: '#0a0a0a', border: '2px solid #FFD700', borderRadius: 20, padding: '32px 28px', marginBottom: 24 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <p style={{ color: '#555', fontSize: 14, marginBottom: 12 }}>GramScaling Pro</p>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 4 }}>
            <span style={{ color: '#FFD700', fontSize: 20, fontWeight: 700, marginTop: 8 }}>$</span>
            <span style={{ color: '#FFD700', fontSize: 64, fontWeight: 900, lineHeight: 1, letterSpacing: '-2px' }}>69</span>
            <span style={{ color: '#555', fontSize: 16, marginTop: 8 }}>/mo</span>
          </div>
          <p style={{ color: '#333', fontSize: 13, marginTop: 6 }}>7-day free trial • Cancel anytime</p>
        </div>

        <div style={{ marginBottom: 28 }}>
          {features.map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ color: '#FFD700', fontSize: 14, flexShrink: 0 }}>✓</span>
              <span style={{ color: '#888', fontSize: 14 }}>{f}</span>
            </div>
          ))}
        </div>

        <Link
          href="/signup"
          style={{ display: 'block', background: '#FFD700', color: '#000', padding: '17px', borderRadius: 50, textDecoration: 'none', fontSize: 17, fontWeight: 900, textAlign: 'center', letterSpacing: '-0.2px' }}
        >
          Start Free Trial
        </Link>
        <p style={{ color: '#333', fontSize: 12, textAlign: 'center', marginTop: 12 }}>No credit card required to start</p>
      </div>

      <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14, padding: '20px', width: '100%', maxWidth: 380, marginBottom: 36 }}>
        <p style={{ color: '#FFD700', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Frequently Asked Questions</p>
        {[
          ['What is GramScaling?', 'An AI tool that analyzes your Instagram and builds you a personalized US growth strategy with daily content ideas.'],
          ['Is there a free trial?', 'Yes — 7 days free. You can cancel anytime within the trial and you won\'t be charged.'],
          ['What if I\'m not happy?', 'Cancel within the first 7 days for a full refund. See our refund policy for details.'],
          ['Do you post automatically?', 'We give you daily scripts and captions ready to paste. Auto-posting is coming soon.'],
        ].map(([q, a]) => (
          <div key={q} style={{ marginBottom: 16 }}>
            <p style={{ color: '#ccc', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{q}</p>
            <p style={{ color: '#555', fontSize: 13, lineHeight: 1.6 }}>{a}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" style={{ color: '#333', fontSize: 13, textDecoration: 'none' }}>← Home</Link>
        <Link href="/refund" style={{ color: '#333', fontSize: 13, textDecoration: 'none' }}>Refund Policy</Link>
        <Link href="/terms" style={{ color: '#333', fontSize: 13, textDecoration: 'none' }}>Terms</Link>
      </div>
    </div>
  )
}
