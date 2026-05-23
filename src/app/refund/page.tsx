import Link from 'next/link'

export default function Refund() {
  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '40px 24px', maxWidth: 600, margin: '0 auto' }}>
      <Link href="/" style={{ color: '#FFD700', fontWeight: 900, fontSize: 20, textDecoration: 'none', display: 'block', marginBottom: 48 }}>
        GramScaling
      </Link>

      <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 900, marginBottom: 8, letterSpacing: '-1px' }}>Refund Policy</h1>
      <p style={{ color: '#333', fontSize: 13, marginBottom: 40 }}>Last updated: May 2026</p>

      {/* Summary box */}
      <div style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.15)', borderRadius: 14, padding: '20px', marginBottom: 36 }}>
        <p style={{ color: '#FFD700', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>The Short Version</p>
        <p style={{ color: '#888', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
          5-day free trial — no charge. After your first payment, you have 5 days to request a full refund. After that, no refunds for the current period, but you can cancel anytime.
        </p>
      </div>

      <div style={{ color: '#888', fontSize: 15, lineHeight: 1.8 }}>
        {[
          ['Free Trial', '5 days free for all new accounts. You will not be charged during your trial. Cancel before the trial ends and you will never be billed.'],
          ['5-Day Money-Back Guarantee', 'If you are not satisfied within 5 days of your first payment, contact us at baroqueincoporated@gmail.com and we will issue a full refund — no questions asked.'],
          ['After 5 Days', 'We do not issue refunds for subscription periods already paid after the 5-day window. This is because AI resources are consumed with each use of the service.'],
          ['How to Cancel', 'Cancel anytime from your Settings page → Billing. After cancellation, your access continues until the end of the current billing period. You will not be charged again.'],
          ['How to Request a Refund', 'Email baroqueincoporated@gmail.com with the subject line "Refund Request" and your account email. We process refunds within 5 business days.'],
          ['Disputes', 'If you believe you were charged in error, please contact us before filing a dispute with your bank. We are happy to resolve billing issues directly.'],
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
        <Link href="/pricing" style={{ color: '#333', fontSize: 13, textDecoration: 'none' }}>Pricing</Link>
      </div>
    </div>
  )
}
