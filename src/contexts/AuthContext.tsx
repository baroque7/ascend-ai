'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function checkSubscribed(user: any): boolean {
  if (!user) return false
  const meta = user.user_metadata || {}
  return meta.subscription_status === 'active' || meta.is_promo === true
}

const AuthContext = createContext<any>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null)
    setLoading(false)
  })
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null)
    setLoading(false)  // ← add this line
  })
  return () => subscription.unsubscribe()
}, [])
 

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
    const subscribed = checkSubscribed(data.user)
    return { success: true, subscribed }
  }

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const isSubscribed = checkSubscribed(user)

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, isSubscribed, supabase }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
