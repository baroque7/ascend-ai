'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Copy, 
  Loader2, 
  Sparkles, 
  Target, 
  Globe,
  Plus,
  CheckCircle
} from 'lucide-react';

interface ContentIdea {
  title: string;
  caption: string;
  hashtags: string[];
  estimatedReach: string;
}

export default function ContentGeneration() {
  const [creatorId, setCreatorId] = useState('');
  const [niche, setNiche] = useState('');
  const [targetCountry, setTargetCountry] = useState('United States');
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const creators = [
    { id: 'creator1', name: 'Sarah Chen' },
    { id: 'creator2', name: 'Mike Johnson' },
    { id: 'creator3', name: 'Emma Wilson' },
    { id: 'creator4', name: 'Alex Rivera' },
    { id: 'creator5', name: 'Jordan Lee' },
    { id: 'creator6', name: 'Taylor Swift' }
  ];

  const niches = [
    'Fashion & Style',
    'Tech Reviews',
    'Food & Cooking',
    'Fitness & Wellness',
    'Travel & Adventure',
    'Beauty & Makeup',
    'Gaming',
    'Business & Finance',
    'Lifestyle & Vlogs',
    'Education & Learning'
  ];

  const countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany',
    'France',
    'Japan',
    'Singapore',
    'Brazil',
    'India',
    'Mexico'
  ];

  const generateContent = async () => {
    if (!creatorId || !niche || !targetCountry) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        'x-user-id': 'mock-user-id', // This will be set by middleware
          'x-user-email': 'mock-email@example.com'
        },
        body: JSON.stringify({
          creatorId,
          niche,
          targetCountry
        })
      });

      const data = await response.json();

      if (data.success) {
        setContentIdeas(data.data.contentIdeas);
      } else {
        setError(data.error || 'Failed to generate content ideas');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#060611]">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#8b5cf6]/10 via-[#3b82f6]/5 to-[#06b6d4]/10 pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 border-b border-[#1e1e3f]">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-white">Content Generation</h1>
              <p className="text-[#a0a0c0]">AI-powered content ideas for your social media</p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Back button */}
              <button
                onClick={() => window.history.back()}
                className="text-[#a0a0c0] hover:text-white transition-colors px-3 py-2 rounded-lg text-sm"
              >
                ← Back
              </button>

              <nav className="hidden md:flex items-center space-x-1">
                <Link 
                  href="/dashboard" 
                  className="text-[#a0a0c0] hover:text-white transition-colors text-sm font-medium"
                >
                  Dashboard
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Generation Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-2xl p-8 mb-8"
          >
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              <Sparkles className="w-6 h-6 mr-2 text-[#8b5cf6]" />
              Generate Content Ideas
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Creator Selector */}
              <div>
                <label className="block text-sm font-medium text-[#f8f8ff] mb-2">
                  Creator Account
                </label>
                <select
                  value={creatorId}
                  onChange={(e) => setCreatorId(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0d0d1f] border border-[#1e1e3f] rounded-lg text-white focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] transition-colors"
                >
                  <option value="">Select creator</option>
                  {creators.map((creator) => (
                    <option key={creator.id} value={creator.id}>
                      {creator.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Niche Input */}
              <div>
                <label className="block text-sm font-medium text-[#f8f8ff] mb-2">
                  Niche/Topic
                </label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0d0d1f] border border-[#1e1e3f] rounded-lg text-white focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] transition-colors"
                >
                  <option value="">Select niche</option>
                  {niches.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              {/* Country Selector */}
              <div>
                <label className="block text-sm font-medium text-[#f8f8ff] mb-2">
                  <Target className="w-4 h-4 mr-2 text-[#8b5cf6]" />
                  Target Country
                </label>
                <select
                  value={targetCountry}
                  onChange={(e) => setTargetCountry(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0d0d1f] border border-[#1e1e3f] rounded-lg text-white focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] transition-colors"
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateContent}
              disabled={isLoading || !creatorId || !niche || !targetCountry}
              className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white font-semibold py-4 px-6 rounded-lg hover:from-[#7c3aed] hover:to-[#2563eb] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Ideas...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Ideas
                </>
              )}
            </button>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400"
              >
                <p>{error}</p>
              </motion.div>
            )}
          </motion.div>

          {/* Content Ideas Display */}
          {contentIdeas.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">
                  <Globe className="w-6 h-6 mr-2 text-[#8b5cf6]" />
                  Generated Content Ideas
                </h3>
                <p className="text-[#a0a0c0]">
                  {contentIdeas.length} ideas generated for {niche} content in {targetCountry}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contentIdeas.map((idea, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="glass-card rounded-xl p-6 hover:border-[#8b5cf6]/50 transition-all duration-300"
                  >
                    {/* Title */}
                    <h4 className="text-lg font-semibold text-white mb-3 line-clamp-2">
                      {idea.title}
                    </h4>

                    {/* Caption */}
                    <p className="text-[#a0a0c0] mb-4 line-clamp-3 text-sm leading-relaxed">
                      {idea.caption}
                    </p>

                    {/* Hashtags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {idea.hashtags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 bg-[#8b5cf6]/20 text-[#8b5cf6] text-xs font-medium rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#1e1e3f]">
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-[#6060a0]" />
                        <span className="text-sm text-[#6060a0]">Est. Reach: {idea.estimatedReach}</span>
                      </div>

                      <button
                        onClick={() => copyToClipboard(idea.caption, `idea-${index}`)}
                        className="flex items-center space-x-2 px-3 py-2 bg-[#1e1e3f] hover:bg-[#2a2a4a] rounded-lg transition-colors text-sm text-white"
                      >
                        {copiedId === `idea-${index}` ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy Caption
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
