'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { resetPassword } from '@/lib/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const { error } = await resetPassword(email);

      if (error) {
        throw error;
      }
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Password reset error:', error);
      setErrors({ general: error instanceof Error ? error.message : 'Failed to send reset email. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#060611] flex flex-col">
        {/* Background gradient */}
        <div className="fixed inset-0 bg-gradient-to-br from-[#8b5cf6]/10 via-[#3b82f6]/5 to-[#06b6d4]/10 pointer-events-none" />
        
        {/* Navigation */}
        <nav className="relative z-10 px-6 py-4">
          <Link 
            href="/login"
            className="inline-flex items-center text-[#a0a0c0] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
        </nav>

        {/* Success content */}
        <div className="flex-1 relative z-10 px-6 py-12 flex items-center justify-center">
          <div className="max-w-md w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-6">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              
              <h1 className="text-3xl font-bold mb-4 text-white">
                Check Your Email
              </h1>
              
              <p className="text-lg text-[#a0a0c0] mb-8">
                We've sent a password reset link to<br />
                <span className="text-[#8b5cf6] font-medium">{email}</span>
              </p>
              
              <div className="glass-card rounded-2xl p-6 text-left mb-6">
                <h2 className="text-lg font-semibold text-white mb-4">What happens next?</h2>
                <ul className="space-y-3 text-sm text-[#a0a0c0]">
                  <li className="flex items-start">
                    <span className="text-[#8b5cf6] mr-2">1.</span>
                    Open your email inbox
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#8b5cf6] mr-2">2.</span>
                    Find the email from Ascend.ai (check spam folder too)
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#8b5cf6] mr-2">3.</span>
                    Click the reset link in the email
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#8b5cf6] mr-2">4.</span>
                    Create a new password
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-[#6060a0]">
                  Didn't receive the email?{' '}
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="text-[#8b5cf6] hover:text-[#a78bfa] transition-colors"
                  >
                    Try again
                  </button>
                </p>
                
                <Link 
                  href="/login"
                  className="inline-block text-sm text-[#8b5cf6] hover:text-[#a78bfa] transition-colors"
                >
                  Back to Sign In
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060611] flex flex-col">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#8b5cf6]/10 via-[#3b82f6]/5 to-[#06b6d4]/10 pointer-events-none" />
      
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <Link 
          href="/login"
          className="inline-flex items-center text-[#a0a0c0] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Link>
      </nav>

      {/* Main content */}
      <div className="flex-1 relative z-10 px-6 py-12 flex items-center justify-center">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8b5cf6]/20 rounded-full mb-6">
              <Mail className="w-8 h-8 text-[#8b5cf6]" />
            </div>
            
            <h1 className="text-3xl font-bold mb-4 text-white">
              Forgot Your Password?
            </h1>
            
            <p className="text-lg text-[#a0a0c0]">
              No worries. Enter your email address and we'll send you a link to reset your password.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card rounded-2xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#f8f8ff] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#0d0d1f] border border-[#1e1e3f] rounded-lg text-white placeholder-[#6060a0] focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] transition-colors"
                  placeholder="you@example.com"
                  disabled={isLoading}
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Error Message */}
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"
                >
                  <p className="text-red-400 text-sm">{errors.general}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white font-semibold py-3 px-6 rounded-lg hover:from-[#7c3aed] hover:to-[#2563eb] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-purple"
              >
                {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-[#a0a0c0]">
                Remember your password?{' '}
                <Link href="/login" className="text-[#8b5cf6] hover:text-[#a78bfa] transition-colors font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Additional Help */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-[#6060a0]">
              Still having trouble?{' '}
              <a href="mailto:support@ascend.ai" className="text-[#8b5cf6] hover:text-[#a78bfa] transition-colors">
                Contact Support
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
