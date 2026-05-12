'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Palette, Sparkles, Eye } from 'lucide-react';
import DashboardNav from '@/components/dashboard/DashboardNav';

export default function PersonaBuilder() {
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [personality, setPersonality] = useState('creative');
  const [tone, setTone] = useState('casual');
  const [generatedPersona, setGeneratedPersona] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePersona = () => {
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const persona = {
        name: `${personality.charAt(0).toUpperCase()}${personality.slice(1)} Creator`,
        platform: selectedPlatform,
        personality: personality,
        tone: tone,
        engagement: 'High',
        followers: Math.floor(Math.random() * 100000) + 50000,
        description: `A ${personality} ${tone} creator who specializes in ${selectedPlatform} content with ${tone} tone. Perfect for engaging with your target audience and building a loyal community.`,
        strengths: [
          `Strong ${personality} content creation skills`,
          'Consistent posting schedule',
          'High engagement rates',
          'Community building expertise'
        ],
        recommendations: [
          `Post ${selectedPlatform} content 3-5 times per week`,
          `Use ${tone} language and tone consistently`,
          'Engage with followers within 2 hours of posting',
          `Collaborate with other ${personality} creators`
        ]
      };
      
      setGeneratedPersona(persona);
      setIsGenerating(false);
    }, 2000);
  };

  const personas = [
    {
      id: 1,
      name: 'Tech Enthusiast',
      platform: 'Instagram',
      personality: 'analytical',
      tone: 'informative',
      engagement: 'High',
      followers: '45.2K',
      description: 'Deep dives into tech reviews and tutorials'
    },
    {
      id: 2,
      name: 'Fashion Icon',
      platform: 'TikTok',
      personality: 'creative',
      tone: 'trendy',
      engagement: 'Very High',
      followers: '128.5K',
      description: 'Showcases latest fashion trends and styles'
    },
    {
      id: 3,
      name: 'Lifestyle Guru',
      platform: 'YouTube',
      personality: 'inspirational',
      tone: 'motivational',
      engagement: 'Medium',
      followers: '89.3K',
      description: 'Shares productivity tips and life hacks'
    }
  ];

  const filteredPersonas = personas.filter(persona => {
    if (selectedPlatform !== 'all' && persona.platform.toLowerCase() !== selectedPlatform) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#060611]">
      <div className="fixed inset-0 bg-gradient-to-br from-[#8b5cf6]/10 via-[#3b82f6]/5 to-[#06b6d4]/10 pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 border-b border-[#1e1e3f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-white hover:text-[#8b5cf6] transition-colors">
                ← Back
              </Link>
              <h1 className="text-xl font-bold text-white">Creator Persona Builder</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Navigation */}
          <DashboardNav currentPage="persona-builder" />

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="bg-[#1e1e3f] border border-[#2e2e4f] text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#8b5cf6]"
            >
              <option value="all">All Platforms</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube</option>
            </select>

            <select
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              className="bg-[#1e1e3f] border border-[#2e2e4f] text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#8b5cf6]"
            >
              <option value="creative">Creative</option>
              <option value="analytical">Analytical</option>
              <option value="inspirational">Inspirational</option>
            </select>

            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="bg-[#1e1e3f] border border-[#2e2e4f] text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#8b5cf6]"
            >
              <option value="casual">Casual</option>
              <option value="professional">Professional</option>
              <option value="motivational">Motivational</option>
            </select>
          </div>

          {/* Builder Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personas Display */}
            <div className="lg:col-span-2 glass-card rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">AI-Generated Personas</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPersonas.map((persona, index) => (
                  <motion.div
                    key={persona.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-4 bg-[#1e1e3f] rounded-lg hover:bg-[#2e2e4f] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{persona.name}</h3>
                          <p className="text-sm text-[#a0a0c0]">{persona.platform}</p>
                        </div>
                      </div>
                      <Eye className="w-4 h-4 text-[#a0a0c0]" />
                    </div>

                    <p className="text-sm text-[#a0a0c0] mb-4">{persona.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[#6060a0] mb-1">Followers</p>
                        <p className="text-lg font-bold text-white">{persona.followers}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6060a0] mb-1">Engagement</p>
                        <p className="text-lg font-bold text-green-400">{persona.engagement}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Persona Builder */}
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Persona Builder
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#a0a0c0] mb-2">Persona Name</label>
                  <input
                    type="text"
                    placeholder="Enter persona name..."
                    className="w-full bg-[#1e1e3f] border border-[#2e2e4f] rounded-lg px-4 py-2 text-white placeholder-[#6060a0] focus:outline-none focus:border-[#8b5cf6]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#a0a0c0] mb-2">Target Audience</label>
                  <input
                    type="text"
                    placeholder="e.g., Gen Z, Tech enthusiasts..."
                    className="w-full bg-[#1e1e3f] border border-[#2e2e4f] rounded-lg px-4 py-2 text-white placeholder-[#6060a0] focus:outline-none focus:border-[#8b5cf6]"
                  />
                </div>

                <button 
                  onClick={generatePersona}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white font-semibold py-3 px-4 rounded-lg hover:from-[#7c3aed] hover:to-[#2563eb] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? 'Generating...' : 'Generate Persona'}
                </button>
              </div>
            </div>

            {/* Generated Persona Results */}
            {generatedPersona && (
              <div className="lg:col-span-3 glass-card rounded-xl p-6 border-2 border-[#8b5cf6]/30">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Generated Persona</h2>
                  <button
                    onClick={() => setGeneratedPersona(null)}
                    className="text-[#a0a0c0] hover:text-white transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <User className="w-5 h-5 mr-2 text-[#8b5cf6]" />
                      {generatedPersona.name}
                    </h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-[#a0a0c0]">Platform</span>
                        <span className="text-white capitalize">{generatedPersona.platform}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#a0a0c0]">Personality</span>
                        <span className="text-white capitalize">{generatedPersona.personality}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#a0a0c0]">Tone</span>
                        <span className="text-white capitalize">{generatedPersona.tone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#a0a0c0]">Followers</span>
                        <span className="text-white">{generatedPersona.followers.toLocaleString()}</span>
                      </div>
                    </div>
                    <p className="text-sm text-[#a0a0c0]">{generatedPersona.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Strengths</h4>
                    <ul className="space-y-2 mb-4">
                      {generatedPersona.strengths.map((strength: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-[#a0a0c0]">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <h4 className="text-lg font-semibold text-white mb-3">Recommendations</h4>
                    <ul className="space-y-2">
                      {generatedPersona.recommendations.map((recommendation: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-[#a0a0c0]">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
