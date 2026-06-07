'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Reads subscription from the DB (the source of truth the payment webhook writes),
// NOT from user_metadata (which a user could edit from their browser). Falls back
// to false on any error — never accidentally grant access.
async function fetchSubscribed(userId: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('users')
      .select('is_subscribed, is_promo')
      .eq('id', userId)
      .single()
    return Boolean(data?.is_subscribed || data?.is_promo)
  } catch {
    return false
  }
}

const AuthContext = createContext<any>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [subscribed, setSubscribed] = useState(false)
  const [subLoading, setSubLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Refresh subscription status from the DB whenever the user changes.
  useEffect(() => {
    let active = true
    if (!user) { setSubscribed(false); setSubLoading(false); return }
    setSubLoading(true)
    fetchSubscribed(user.id).then((sub) => {
      if (!active) return
      setSubscribed(sub)
      setSubLoading(false)
    })
    return () => { active = false }
  }, [user?.id])

  async function signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) return { error: error.message }
    return { success: true, user: data.user }
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    const subscribed = data.user ? await fetchSubscribed(data.user.id) : false
    return { success: true, subscribed }
  }

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  // Stay "loading" until BOTH the session and the subscription check resolve,
  // so the dashboard gate doesn't briefly redirect a paid user to /payment.
  const loading = authLoading || subLoading
  const isSubscribed = subscribed

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, isSubscribed, supabase }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
