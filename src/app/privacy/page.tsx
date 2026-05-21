import Link from 'next/link'

export default function Privacy() {
  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '40px 24px', maxWidth: 600, margin: '0 auto' }}>
      <Link href="/" style={{ color: '#FFD700', fontWeight: 900, fontSize: 20, textDecoration: 'none', display: 'block', marginBottom: 48 }}>
        GramScaling
      </Link>

      <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 900, marginBottom: 8, letterSpacing: '-1px' }}>Privacy Policy</h1>
      <p style={{ color: '#333', fontSize: 13, marginBottom: 40 }}>Last updated: May 2026</p>

      <div style={{ color: '#888', fontSize: 15, lineHeight: 1.8 }}>
        {[
          ['1. What We Collect', 'We collect: (a) your email address and name at signup, (b) your Instagram username when you request an analysis, (c) usage data such as pages visited and features used, and (d) payment information processed securely by Polar (we never store card numbers).'],
          ['2. How We Use Your Data', 'Your data is used to: provide and improve the GramScaling service, generate AI-powered content strategies, send you important account emails, and prevent fraud and abuse. We do not sell your personal data to third parties.'],
          ['3. AI Processing', 'When you request an analysis, your Instagram username and optional niche description are sent to Google\'s Gemini AI API. No other personal data is sent. Google\'s privacy policy applies to this processing.'],
          ['4. Data Storage', 'Your account data is stored securely in Supabase (PostgreSQL) with encryption at rest. We retain your data as long as your account is active or as required by law.'],
          ['5. Cookies', 'We use session cookies for authentication only. We do not use tracking or advertising cookies. You can disable cookies in your browser, but this will prevent login from working.'],
          ['6. Third-Party Services', 'We use: Supabase (database), Polar (payments), Google Gemini (AI analysis), and Vercel (hosting). Each operates under their own privacy policy.'],
          ['7. Your Rights', 'You have the right to: access your personal data, correct inaccurate data, delete your account and all associated data, and export your data. To exercise these rights, email baroqueincoporated@gmail.com.'],
          ['8. Data Deletion', 'To delete your account and all data, email us or cancel your subscription and request deletion. We will process deletion within 30 days.'],
          ['9. Children\'s Privacy', 'GramScaling is not directed at children under 13. We do not knowingly collect data from children.'],
          ['10. Contact', 'Privacy questions? Email baroqueincoporated@gmail.com'],
        ].map(([title, text]) => (
          <div key={title} style={{ marginBottom: 28 }}>
            <h2 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{title}</h2>
            <p style={{ margin: 0 }}>{text}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 20, marginTop: 40, flexWrap: 'wrap' }}>
        <Link href="/" style={{ color: '#333', fontSize: 13, textDecoration: 'none' }}>← Home</Link>
        <Link href="/terms" style={{ color: '#333', fontSize: 13, textDecoration: 'none' }}>Terms of Service</Link>
      </div>
    </div>
  )
}
