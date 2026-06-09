import Link from 'next/link'

export default function Refund() {
  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '40px 24px', maxWidth: 600, margin: '0 auto' }}>
      <Link href="/" style={{ color: '#FFD700', fontWeight: 900, fontSize: 20, textDecoration: 'none', display: 'block', marginBottom: 48 }}>
        GramScaling
      </Link>

      <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 900, marginBottom: 8, letterSpacing: '-1px' }}>Refund Policy</h1>
      <p style={{ color: '#333', fontSize: 13, marginBottom: 40 }}>Last updated: June 2026</p>

      {/* Summary box */}
      <div style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.15)', borderRadius: 14, padding: '20px', marginBottom: 36 }}>
        <p style={{ color: '#FFD700', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>The Short Version</p>
        <p style={{ color: '#888', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
          All subscription payments are final — we don&apos;t offer refunds. You can cancel anytime, and you won&apos;t be charged again.
        </p>
      </div>

      <div style={{ color: '#888', fontSize: 15, lineHeight: 1.8 }}>
        {[
          ['All Sales Final', 'GramScaling is a subscription service that delivers AI-generated content and analysis. Because AI resources are consumed each time the service is used, all payments are final and we do not offer refunds for subscription periods — current or past.'],
          ['Cancel Anytime', 'You can cancel your subscription at any time from your Settings page. After cancellation, your access continues until the end of the current billing period, and you will not be charged again.'],
          ['Billing Errors', 'If you believe you were charged in error (for example, a duplicate charge), email support@gramscaling.com with the subject line "Billing Issue" and your account email. We will investigate and correct any genuine billing errors.'],
          ['Disputes', 'If you believe there is a billing problem, please contact us before filing a dispute with your bank. We are happy to resolve billing issues directly.'],
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
