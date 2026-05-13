"use client";

import React, { useState } from 'react';
import { Upload, Plus, X, Film, Image as ImageIcon } from 'lucide-react';

export default function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#FFD700]">Upload</h1>
        <p className="text-gray-500 text-sm mt-1">Videos will be posted from US Cloud Phone</p>
      </header>

      <div className="space-y-6">
        {/* Upload Box */}
        <div className="relative border-2 border-dashed border-[#222] rounded-3xl p-10 flex flex-col items-center justify-center bg-[#0a0a0a] group hover:border-[#FFD700]/50 transition-all">
          <input 
            type="file" 
            multiple 
            accept="video/*,image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
          <div className="w-16 h-16 bg-[#FFD700]/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus className="text-[#FFD700] w-8 h-8" />
          </div>
          <p className="font-bold text-lg">Tap to select media</p>
          <p className="text-gray-500 text-xs mt-1 text-center">Supports Video & Multiple Photos (Carousel)</p>
        </div>

        {/* Selected Files Preview */}
        {selectedFiles.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="relative aspect-square bg-[#111] rounded-2xl border border-[#222] flex items-center justify-center overflow-hidden">
                <button 
                  onClick={() => removeFile(idx)}
                  className="absolute top-2 right-2 bg-red-600 rounded-full p-1 z-10"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
                {file.type.startsWith('video') ? (
                  <Film className="text-gray-600 w-8 h-8" />
                ) : (
                  <ImageIcon className="text-gray-600 w-8 h-8" />
                )}
                <p className="absolute bottom-2 left-2 text-[10px] text-gray-400 truncate w-[80%]">
                  {file.name}
                </p>
              </div>
            ))}
          </div>
        )}

        <button 
          disabled={selectedFiles.length === 0}
          className={w-full py-4 rounded-2xl font-bold text-lg transition-all ${
            selectedFiles.length > 0 
            ? 'bg-[#FFD700] text-black shadow-[0_0_20px_rgba(255,215,0,0.3)]' 
            : 'bg-[#111] text-gray-600 cursor-not-allowed'
          }}
        >
          {selectedFiles.length > 0 ? Schedule ${selectedFiles.length} Posts : 'Waiting for media...'}
        </button>
      </div>
    </div>
  );
}