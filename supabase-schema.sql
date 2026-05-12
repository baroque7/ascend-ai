-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  plan TEXT CHECK (plan IN ('creator', 'agency', 'agency-pro')) DEFAULT 'creator',
  subscription_status TEXT CHECK (subscription_status IN ('active', 'inactive', 'past_due')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert profile bypassing RLS
  INSERT INTO public.profiles (id, email, full_name, plan)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'plan', 'creator')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create creator_accounts table
CREATE TABLE IF NOT EXISTS creator_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_name TEXT NOT NULL,
  instagram_username TEXT NOT NULL,
  target_country TEXT DEFAULT 'US',
  content_niche TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own accounts" ON creator_accounts;
DROP POLICY IF EXISTS "Users can insert own accounts" ON creator_accounts;
DROP POLICY IF EXISTS "Users can update own accounts" ON creator_accounts;
DROP POLICY IF EXISTS "Users can delete own accounts" ON creator_accounts;

-- Recreate policies correctly
CREATE POLICY "Users can view own accounts" 
ON creator_accounts FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own accounts" 
ON creator_accounts FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own accounts" 
ON creator_accounts FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own accounts" 
ON creator_accounts FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for profiles table
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create trigger for creator_accounts table
CREATE TRIGGER creator_accounts_updated_at
  BEFORE UPDATE ON creator_accounts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
