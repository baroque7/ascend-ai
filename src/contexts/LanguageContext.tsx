'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getT, type Language, type TranslationKey } from '@/lib/translations'
import { getStoredLanguage, setStoredLanguage } from '@/lib/utils'

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Start English (matches server render), then adopt the stored choice on mount
  const [language, setLanguageState] = useState<Language>('English')

  useEffect(() => {
    setLanguageState(getStoredLanguage())
  }, [])

  function setLanguage(lang: Language) {
    setLanguageState(lang)
    setStoredLanguage(lang)
  }

  const t = getT(language)

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
