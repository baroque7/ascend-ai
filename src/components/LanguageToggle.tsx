'use client'
import { useLanguage } from '@/contexts/LanguageContext'
import type { Language } from '@/lib/translations'

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div style={{ display: 'flex', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 50, padding: 3 }}>
      {(['English', 'Spanish'] as Language[]).map(lang => {
        const active = language === lang
        return (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            aria-label={lang}
            style={{
              background: active ? '#FFD700' : 'transparent',
              color: active ? '#000' : '#666',
              border: 'none',
              borderRadius: 50,
              padding: '5px 12px',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {lang === 'English' ? 'EN' : 'ES'}
          </button>
        )
      })}
    </div>
  )
}
