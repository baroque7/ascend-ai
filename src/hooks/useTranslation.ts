'use client'
import { useLanguage } from '@/contexts/LanguageContext'

// Reads the app-wide language from LanguageContext (localStorage-backed, no DB).
export function useTranslation() {
  const { t, language } = useLanguage()
  return { t, language }
}
