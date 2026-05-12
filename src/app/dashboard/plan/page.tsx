"use client";

import React from 'react';

// This definition tells TypeScript exactly what a "Task" looks like
interface Task {
  id: number;
  title: string;
  status: 'completed' | 'current' | 'upcoming';
  date: string;
  description: string;
}

const PlanPage = () => {
  // These are the tasks that were causing the error
  const tasks: Task[] = [
    { 
      id: 1, 
      title: "Account Warm-up", 
      status: 'completed', 
      date: "Day 1-3", 
      description: "Establishing US-based engagement patterns with your new cloud phone." 
    },
    { 
      id: 2, 
      title: "Niche Selection", 
      status: 'current', 
      date: "Day 4", 
      description: "Finalizing your content category for the US market optimization." 
    },
    { 
      id: 3, 
      title: "First Viral Hook", 
      status: 'upcoming', 
      date: "Day 5", 
      description: "Launching your first AI-optimized video to the US FYP." 
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24 font-sans">
      <h1 className="text-2xl font-bold mb-6 text-[#FFD700]">30-Day Growth Plan</h1>
      
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="border border-[#111111] p-5 rounded-2xl bg-[#0a0a0a]">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[#FFD700] text-sm font-mono font-semibold">{task.date}</span>
              <span className={text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                task.status === 'completed' ? 'bg-green-900/30 text-green-400 border border-green-800' : 
                task.status === 'current' ? 'bg-[#FFD700] text-black' : 
                'bg-gray-800 text-gray-400 border border-gray-700'
              }}>
                {task.status}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">{task.title}</h3>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">{task.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 border border-dashed border-[#FFD700]/30 rounded-xl bg-[#FFD700]/5">
        <p className="text-[#FFD700] text-xs text-center font-medium">
          Your AI plan updates every 24 hours based on US trend data.
        </p>
      </div>
    </div>
  );
};

export default PlanPage;