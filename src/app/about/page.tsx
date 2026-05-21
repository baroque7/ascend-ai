import Link from 'next/link'

export default function About() {
  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '40px 24px', maxWidth: 560, margin: '0 auto' }}>
      <Link href="/" style={{ color: '#FFD700', fontWeight: 900, fontSize: 20, textDecoration: 'none', display: 'block', marginBottom: 48 }}>
        GramScaling
      </Link>

      <h1 style={{ color: '#fff', fontSize: 34, fontWeight: 900, marginBottom: 16, letterSpacing: '-1px' }}>About GramScaling</h1>
      <p style={{ color: '#555', fontSize: 16, marginBottom: 40 }}>We help creators grow their US audience with AI.</p>

      <div style={{ marginBottom: 36 }}>
        <h2 style={{ color: '#FFD700', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Our Mission</h2>
        <p style={{ color: '#888', fontSize: 15, lineHeight: 1.75 }}>
          Most creators outside the US struggle to reach American audiences because the algorithm treats them as foreign accounts. GramScaling solves this by giving you the exact strategy, content, and hashtags that the US algorithm rewards — so you grow like a local creator no matter where you are.
        </p>
      </div>

      <div style={{ marginBottom: 36 }}>
        <h2 style={{ color: '#FFD700', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>How It Works</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { icon: '🔍', title: 'AI Profile Analysis', desc: 'Our AI reads your Instagram profile and identifies your best-fit niche for the US market.' },
            { icon: '🎯', title: 'Personalized Strategy', desc: 'You get a full US growth plan including niche, hashtags, posting times, and profile tips.' },
            { icon: '📅', title: 'Daily Content Ideas', desc: 'Every day, AI generates fresh scripts and captions tailored to US trending topics in your niche.' },
            { icon: '📈', title: 'Track Your Growth', desc: 'Monitor your US audience growth over time and see what\'s working.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ display: 'flex', gap: 14, background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 12, padding: '16px' }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{icon}</span>
              <div>
                <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: '0 0 4px' }}>{title}</p>
                <p style={{ color: '#555', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 36 }}>
        <h2 style={{ color: '#FFD700', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Contact</h2>
        <p style={{ color: '#888', fontSize: 15, lineHeight: 1.7 }}>
          Questions or need help? Email us at{' '}
          <a href="mailto:baroqueincoporated@gmail.com" style={{ color: '#FFD700', textDecoration: 'none' }}>
            baroqueincoporated@gmail.com
          </a>
        </p>
      </div>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <Link href="/" style={{ color: '#333', fontSize: 13, textDecoration: 'none' }}>← Home</Link>
        <Link href="/pricing" style={{ color: '#333', fontSize: 13, textDecoration: 'none' }}>Pricing</Link>
        <Link href="/terms" style={{ color: '#333', fontSize: 13, textDecoration: 'none' }}>Terms</Link>
        <Link href="/privacy" style={{ color: '#333', fontSize: 13, textDecoration: 'none' }}>Privacy</Link>
      </div>
    </div>
  )
}
