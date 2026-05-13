"use client";
import React, { useState } from 'react';
import { Plus, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function UploadPage() {
  const [files] = useState([]);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex items-center mb-8">
        <Link href="/dashboard" className="text-[#FFD700] mr-4"><ChevronLeft /></Link>
        <h1 className="text-2xl font-bold">Upload</h1>
      </div>
      <div className="space-y-6">
        <div className="border-2 border-dashed border-gray-800 rounded-3xl p-12 flex flex-col items-center bg-[#0a0a0a]">
          <Plus className="text-[#FFD700] w-8 h-8 mb-4" />
          <p className="font-bold">Select Media</p>
        </div>
        <button 
          disabled={files.length === 0}
          className="w-full py-4 rounded-2xl font-bold text-lg bg-[#111] text-gray-600"
        >
          Waiting for media...
        </button>
      </div>
    </div>
  );
}