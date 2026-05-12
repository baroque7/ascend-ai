'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lightbulb, Plus, Settings } from 'lucide-react';

interface BottomNavProps {
  currentPage?: string;
}

export default function BottomNav({ currentPage }: BottomNavProps) {
  const [activeTab, setActiveTab] = useState(currentPage || 'ideas');

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-[#FFD700]/20 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-around py-2">
          {/* Ideas Tab - Left */}
          <Link
            href="/dashboard/ideas"
            onClick={() => setActiveTab('ideas')}
            className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'ideas' || currentPage === 'ideas'
                ? 'text-[#FFD700]'
                : 'text-[#a0a0c0] hover:text-white'
            }`}
          >
            <Lightbulb className="w-5 h-5" />
            <span className="text-xs font-medium">Ideas</span>
          </Link>

          {/* Upload Tab - Center with Gold Plus Button */}
          <Link
            href="/dashboard/upload"
            onClick={() => setActiveTab('upload')}
            className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-colors relative ${
              activeTab === 'upload' || currentPage === 'upload'
                ? 'text-[#FFD700]'
                : 'text-[#a0a0c0] hover:text-white'
            }`}
          >
            <div className="relative">
              <Plus className="w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#FFD700] rounded-full animate-pulse" />
            </div>
            <span className="text-xs font-medium">Upload</span>
          </Link>

          {/* Settings Tab - Right */}
          <Link
            href="/dashboard/settings"
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'settings' || currentPage === 'settings'
                ? 'text-[#FFD700]'
                : 'text-[#a0a0c0] hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs font-medium">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
