'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ShieldCheck, Globe, Smartphone, ChevronLeft, Camera } from 'lucide-react'

export default function Account() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [link, setLink] = useState('')
  const [saved, setSaved] = useState(false)

  // Mock technical data (In the future, this comes from your Proxy/GeeLark API)
  const [infra] = useState({
    status: 'Setting Up',
    proxyIp: '64.225.101.42', // Example US Proxy IP
    location: 'New York, US',
    deviceId: 'GL-PIXEL6-772'
  })

  async function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    // Here we will eventually add the Supabase 'update profile' call
  }

  return (
    <div className="min-h-screen bg-black text-white p-5 pb-24 font-sans">
      
      {/* HEADER */}
      <div className="flex items-center mb-8">
        <Link href="/dashboard" className="text-[#FFD700] text-2xl font-bold mr-4">
          <ChevronLeft className="w-8 h-8" />
        </Link>
        <h1 className="text-xl font-bold">My TikTok Account</h1>
      </div>

      {/* PROFILE PHOTO SECTION */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative group cursor-pointer">
          <div className="w-24 h-24 bg-[#111] border-2 border-dashed border-gray-800 rounded-full flex items-center justify-center text-3xl mb-2 transition-all group-hover:border-[#FFD700]">
            👤
          </div>
          <div className="absolute bottom-2 right-0 bg-[#FFD700] p-1.5 rounded-full border-2 border-black">
            <Camera className="w-3 h-3 text-black" />
          </div>
        </div>
        <p className="text-[#FFD700] text-xs font-medium uppercase tracking-wider">Change Photo</p>
      </div>

      {/* ACCOUNT DETAILS FORM */}
      <div className="bg-[#0a0a0a] border border-gray-900 rounded-2xl overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-900">
          <label className="text-gray-500 text-[10px] uppercase font-bold mb-1 block">Display Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={e=>setName(e.target.value)} 
            placeholder="Your name" 
            className="w-full bg-transparent border-none text-white text-base outline-none focus:ring-0 p-0"
          />
        </div>
        <div className="p-4 border-b border-gray-900">
          <label className="text-gray-500 text-[10px] uppercase font-bold mb-1 block">Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={e=>setUsername(e.target.value)} 
            placeholder="@username" 
            className="w-full bg-transparent border-none text-white text-base outline-none focus:ring-0 p-0"
          />
        </div>
        <div className="p-4 border-b border-gray-900">
          <label className="text-gray-500 text-[10px] uppercase font-bold mb-1 block">Bio</label>
          <textarea 
            value={bio} 
            onChange={e=>setBio(e.target.value)} 
            placeholder="Write something about yourself..." 
            rows={2} 
            className="w-full bg-transparent border-none text-white text-base outline-none focus:ring-0 p-0 resize-none"
          />
        </div>
        <div className="p-4">
          <label className="text-gray-500 text-[10px] uppercase font-bold mb-1 block">Link in Bio</label>
          <input 
            type="text" 
            value={link} 
            onChange={e=>setLink(e.target.value)} 
            placeholder="https://yourlink.com" 
            className="w-full bg-transparent border-none text-white text-base outline-none focus:ring-0 p-0"
          />
        </div>
      </div>
{/* US INFRASTRUCTURE STATUS (The "Money" Section) */}
      <div className="bg-[#0a0a0a] border border-[#FFD700]/20 rounded-2xl p-5 mb-8">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-sm font-bold">Infrastructure Status</h3>
          <span className="bg-[#FFD700] text-black text-[10px] font-black px-3 py-1 rounded-full animate-pulse">
            {infra.status.toUpperCase()}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-400">
              <Globe className="w-3 h-3" />
              <span>US Proxy IP</span>
            </div>
            <span className="font-mono text-gray-200">{infra.proxyIp}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-400">
              <Smartphone className="w-3 h-3" />
              <span>Cloud Phone ID</span>
            </div>
            <span className="font-mono text-gray-200">{infra.deviceId}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-900">
          <p className="text-[9px] text-red-500 font-bold uppercase">⚠️ Warning</p>
          <p className="text-[10px] text-gray-500 italic">Account is locked to this US IP. Manual login from local devices is strictly prohibited.</p>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <button 
        onClick={handleSave} 
        className="w-full py-4 bg-[#FFD700] hover:bg-yellow-500 text-black rounded-full font-bold text-lg transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,215,0,0.2)]"
      >
        {saved ? '✅ Changes Saved' : 'Update Profile'}
      </button>

    </div>
  )
}