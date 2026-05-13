"use client";
import React, { useState } from 'react';
import { Plus, ChevronLeft, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState([]);

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24">
      <div className="flex items-center mb-8">
        <Link href="/dashboard" className="text-[#FFD700] mr-4"><ChevronLeft className="w-6 h-6" /></Link>
        <h1 className="text-2xl font-bold">Upload</h1>
      </div>
      <div className="space-y-6">
        <div className="border-2 border-dashed border-gray-800 rounded-3xl p-12 flex flex-col items-center bg-[#0a0a0a] active:scale-95 transition-transform">
          <div className="bg-[#FFD700]/10 p-4 rounded-full mb-4">
            <Plus className="text-[#FFD700] w-8 h-8" />
          </div>
          <p className="font-bold">Select Media</p>
          <p className="text-gray-600 text-xs mt-1">TikTok Multi-Photo Support</p>
        </div>
        <button 
          disabled={selectedFiles.length === 0}
          className={w-full py-4 rounded-2xl font-bold text-lg transition-all ${
            selectedFiles.length > 0 ? 'bg-[#FFD700] text-black' : 'bg-gray-900 text-gray-600'
          }}
        >
          {selectedFiles.length > 0 ? 'Schedule Post' : 'Waiting for media...'}
        </button>
      </div>
    </div>
  );
}