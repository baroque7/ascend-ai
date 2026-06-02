export function normalizeHandle(input: string): string {
  return input.replace('@', '').trim().toLowerCase()
}

const LANGUAGE_KEY = 'gs_language'

// Read the visitor's chosen UI language (set on the landing page toggle).
// Defaults to English. Safe to call on the server — returns the default there.
export function getStoredLanguage(): 'English' | 'Spanish' {
  if (typeof window === 'undefined') return 'English'
  return localStorage.getItem(LANGUAGE_KEY) === 'Spanish' ? 'Spanish' : 'English'
}

export function setStoredLanguage(language: 'English' | 'Spanish'): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(LANGUAGE_KEY, language)
}
