import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface User {
  id: string;
  email: string;
  full_name: string;
  plan: 'creator' | 'agency' | 'agency-pro';
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User | null;
  error: Error | null;
}

// Authentication functions
export const signUp = async (email: string, password: string, fullName: string, plan: string) => {
  try {
    console.log('Starting signup process for:', email);
    
    // Create the user in Supabase Auth - trigger will automatically create profile
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          plan: plan
        }
      }
    });

    if (authError) {
      console.error('Auth error during signup:', authError);
      throw new Error(`Authentication failed: ${authError.message}`);
    }

    console.log('Auth successful, user created:', authData.user?.id);
    console.log('Profile will be created automatically by trigger');

    return { user: authData.user, error: null };
  } catch (error) {
    console.error('Signup error:', error);
    return { 
      user: null, 
      error: error instanceof Error ? error : new Error('Unknown error occurred during signup') 
    };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    return { user: data.user, error: null };
  } catch (error) {
    return { user: null, error: error as Error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    return { user: null, error: error as Error };
  }
};

// Listen for auth changes
export const onAuthStateChange = (callback: (user: any) => void) => {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
};
