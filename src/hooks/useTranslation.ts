'use client'
import { useProfile } from '@/hooks/useProfile'
import { getT, type Language } from '@/lib/translations'

export function useTranslation(languageOverride?: string) {
  const { profile } = useProfile()
  const language = (languageOverride ?? profile?.language ?? 'English') as Language
  return { t: getT(language), language }
}
