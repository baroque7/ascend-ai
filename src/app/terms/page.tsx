import Link from 'next/link'

export default function Terms() {
  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '40px 24px', maxWidth: 600, margin: '0 auto' }}>
      <Link href="/" style={{ color: '#FFD700', fontWeight: 900, fontSize: 20, textDecoration: 'none', display: 'block', marginBottom: 48 }}>
        GramScaling
      </Link>

      <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 900, marginBottom: 8, letterSpacing: '-1px' }}>Terms of Service</h1>
      <p style={{ color: '#333', fontSize: 13, marginBottom: 40 }}>Last updated: May 2026</p>

      <div style={{ color: '#888', fontSize: 15, lineHeight: 1.8 }}>
        {[
          ['1. Service Description', 'GramScaling is an AI-powered Instagram growth tool. We analyze your profile, generate content strategies, and provide daily content ideas to help you reach US audiences. You remain in full control of your account and content.'],
          ['2. Subscription & Billing', 'GramScaling is $69.99/month, billed monthly and auto-renewing. You may cancel at any time from your account settings, and you will not be charged again after cancellation.'],
          ['3. User Responsibilities', 'You agree to (a) provide accurate information during signup, (b) only use the service for lawful purposes, (c) not share your account credentials, and (d) comply with Instagram\'s Terms of Service and Community Guidelines.'],
          ['4. Content Ownership', 'You retain full ownership of any content you create. GramScaling does not claim ownership over your posts, captions, or media. AI-generated scripts are provided as suggestions — you\'re free to edit them.'],
          ['5. No Guarantee of Results', 'While our AI provides best-in-class growth strategies, we cannot guarantee specific follower counts, views, or engagement metrics. Results depend on your posting consistency and content quality.'],
          ['6. Refund Policy', 'All subscription payments are final and non-refundable. You may cancel at any time to stop future billing. See our Refund Policy for full details.'],
          ['7. Account Termination', 'We reserve the right to suspend or terminate accounts that violate these terms, engage in abuse, or attempt to reverse-engineer our service.'],
          ['8. Limitation of Liability', 'GramScaling is not liable for any indirect, incidental, or consequential damages arising from use of our service. Our maximum liability is limited to the amount you paid in the last 30 days.'],
          ['9. Changes to Terms', 'We may update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.'],
          ['10. Contact', 'Questions about these Terms? Email baroqueincoporated@gmail.com'],
        ].map(([title, text]) => (
          <div key={title} style={{ marginBottom: 28 }}>
            <h2 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{title}</h2>
            <p style={{ margin: 0 }}>{text}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 20, marginTop: 40, flexWrap: 'wrap' }}>
        <Link href="/" style={{ color: '#333', fontSize: 13, textDecoration: 'none' }}>← Home</Link>
        <Link href="/privacy" style={{ color: '#333', fontSize: 13, textDecoration: 'none' }}>Privacy Policy</Link>
        <Link href="/refund" style={{ color: '#333', fontSize: 13, textDecoration: 'none' }}>Refund Policy</Link>
      </div>
    </div>
  )
}
