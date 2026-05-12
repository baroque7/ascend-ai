'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Sparkles, Target, Zap, Users } from 'lucide-react';

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to Ascend.ai',
    description: 'Let\'s get you set up and ready to grow your audience with AI-powered content intelligence.',
    icon: Sparkles
  },
  {
    id: 'goals',
    title: 'What are your goals?',
    description: 'Help us understand what you want to achieve so we can personalize your experience.',
    icon: Target
  },
  {
    id: 'platforms',
    title: 'Connect your platforms',
    description: 'Connect your social media accounts to start analyzing content and trends.',
    icon: Zap
  },
  {
    id: 'complete',
    title: 'You\'re all set!',
    description: 'Your account is ready. Let\'s start growing your audience together.',
    icon: Users
  }
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const goals = [
    'Increase follower count',
    'Boost engagement rates',
    'Find trending content',
    'Content safety checking',
    'Multi-account management',
    'Competitor analysis'
  ];

  const handleGoalToggle = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete onboarding and redirect to dashboard
      router.push('/dashboard');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="min-h-screen bg-[#060611] flex flex-col">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#8b5cf6]/10 via-[#3b82f6]/5 to-[#06b6d4]/10 pointer-events-none" />
      
      {/* Progress bar */}
      <div className="relative z-10 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link 
              href="/"
              className="text-[#a0a0c0] hover:text-white transition-colors"
            >
              Skip onboarding
            </Link>
            <div className="text-sm text-[#a0a0c0]">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          
          <div className="relative">
            <div className="h-1 bg-[#1e1e3f] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6]"
                initial={{ width: '25%' }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 relative z-10 px-6 py-12 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8b5cf6]/20 rounded-full mb-6">
              <Icon className="w-8 h-8 text-[#8b5cf6]" />
            </div>

            {/* Title and description */}
            <h1 className="text-3xl font-bold mb-4 text-white">
              {currentStepData.title}
            </h1>
            <p className="text-lg text-[#a0a0c0] mb-8">
              {currentStepData.description}
            </p>

            {/* Step-specific content */}
            {currentStep === 1 && (
              <div className="mb-8">
                <div className="grid grid-cols-2 gap-3 text-left">
                  {goals.map((goal, index) => (
                    <button
                      key={index}
                      onClick={() => handleGoalToggle(goal)}
                      className={`p-4 rounded-lg border transition-all duration-300 ${
                        selectedGoals.includes(goal)
                          ? 'border-[#8b5cf6] bg-[#8b5cf6]/10'
                          : 'border-[#1e1e3f] hover:border-[#3b82f6]'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                          selectedGoals.includes(goal)
                            ? 'border-[#8b5cf6] bg-[#8b5cf6]'
                            : 'border-[#1e1e3f]'
                        }`}>
                          {selectedGoals.includes(goal) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="text-sm text-white">{goal}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="mb-8 space-y-4">
                <div className="glass-card rounded-xl p-6 text-left">
                  <h3 className="text-lg font-semibold text-white mb-4">Connect your accounts</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-4 bg-[#0d0d1f] border border-[#1e1e3f] rounded-lg hover:border-[#8b5cf6] transition-colors">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-black rounded-lg mr-3"></div>
                        <span className="text-white">TikTok</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#a0a0c0]" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-[#0d0d1f] border border-[#1e1e3f] rounded-lg hover:border-[#8b5cf6] transition-colors">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg mr-3"></div>
                        <span className="text-white">Instagram</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#a0a0c0]" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-[#0d0d1f] border border-[#1e1e3f] rounded-lg hover:border-[#8b5cf6] transition-colors">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg mr-3"></div>
                        <span className="text-white">Twitter</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#a0a0c0]" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-[#6060a0]">
                  You can connect more accounts later from your dashboard settings.
                </p>
              </div>
            )}

            {currentStep === 3 && (
              <div className="mb-8">
                <div className="glass-card rounded-2xl p-8">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Ready to ascend!
                  </h3>
                  <p className="text-[#a0a0c0]">
                    Your account is set up and ready to use. Start analyzing content, tracking trends, and growing your audience.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-4 justify-center">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="px-6 py-3 border border-[#1e1e3f] text-white rounded-lg hover:border-[#3b82f6] transition-colors"
                >
                  Previous
                </button>
              )}
              
              <button
                onClick={handleNext}
                disabled={currentStep === 1 && selectedGoals.length === 0}
                className="px-8 py-3 bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white font-semibold rounded-lg hover:from-[#7c3aed] hover:to-[#2563eb] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-purple min-w-[120px]"
              >
                {currentStep === steps.length - 1 ? 'Go to Dashboard' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2 inline" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
