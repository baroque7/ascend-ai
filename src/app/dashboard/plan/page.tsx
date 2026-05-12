'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Clock, Target, TrendingUp, X } from 'lucide-react';
import DashboardNav from '@/components/dashboard/DashboardNav';

export default function DayPlan() {
  const [selectedDay, setSelectedDay] = useState(1);
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Morning TikTok Post', platform: 'tiktok', time: '09:00', day: 1, completed: false },
    { id: 2, title: 'TikTok Dance Video', platform: 'tiktok', time: '12:00', day: 1, completed: false },
    { id: 3, title: 'TikTok Tech Review', platform: 'tiktok', time: '15:00', day: 1, completed: false },
    { id: 4, title: 'TikTok Trending Content', platform: 'tiktok', time: '18:00', day: 1, completed: false },
    { id: 5, title: 'Morning Workout Post', platform: 'tiktok', time: '08:00', day: 2, completed: false },
    { id: 6, title: 'Lunch Recipe Reel', platform: 'tiktok', time: '12:30', day: 2, completed: false },
    { id: 7, title: 'Evening Q&A', platform: 'tiktok', time: '19:00', day: 2, completed: false },
  ]);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    platform: 'tiktok',
    time: '09:00',
    date: '',
    description: ''
  });

  const toggleTask = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    if (newTask.title.trim()) {
      const taskId = Math.max(...tasks.map(t => t.id), 0) + 1;
      setTasks([...tasks, {
        id: taskId,
        title: newTask.title,
        platform: newTask.platform,
        time: newTask.time,
        date: newTask.date,
        description: newTask.description,
        day: selectedDay,
        completed: false
      }]);
      setNewTask({ title: '', platform: 'tiktok', time: '09:00', date: '', description: '' });
      setShowAddTaskModal(false);
    }
  };

  const editTask = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setEditingTask(taskId);
      setNewTask({
        title: task.title,
        platform: task.platform,
        time: task.time,
        date: task.date || '',
        description: task.description || ''
      });
      setShowAddTaskModal(true);
    }
  };

  const updateTask = () => {
    if (editingTask && newTask.title.trim()) {
      setTasks(tasks.map(task => 
        task.id === editingTask 
          ? { ...task, title: newTask.title, platform: newTask.platform, time: newTask.time, date: newTask.date, description: newTask.description, day: task.day }
          : task
      ));
      setNewTask({ title: '', platform: 'tiktok', time: '09:00', date: '', description: '' });
      setEditingTask(null);
      setShowAddTaskModal(false);
    }
  };

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const currentDayTasks = tasks.filter(task => task.day === selectedDay);

  const completionRate = Math.round((currentDayTasks.filter(task => task.completed).length / currentDayTasks.length) * 100);

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
              <h1 className="text-xl font-bold text-white">30 Day Plan</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Navigation */}
          <DashboardNav currentPage="plan" />

          {/* Day Selector */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Calendar className="w-5 h-5 text-[#8b5cf6]" />
              <h2 className="text-xl font-semibold text-white">Day {selectedDay}</h2>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-[#a0a0c0]">Completion Rate:</span>
              <span className="text-lg font-bold text-green-400">{completionRate}%</span>
            </div>
          </div>

          {/* Week Overview */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            {[1, 2, 3, 4, 5].map((day) => (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: day * 0.1 }}
                onClick={() => setSelectedDay(day)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                  selectedDay === day 
                    ? 'bg-[#8b5cf6]/20 border-[#8b5cf6]/50' 
                    : 'glass-card hover:border-[#8b5cf6]/30'
                }`}
              >
                <div className="text-center">
                  <p className="text-sm font-medium text-white mb-2">Day {day}</p>
                  <div className="w-full h-16 bg-[#1e1e3f] rounded-lg flex items-center justify-center">
                    {(() => {
                      const dayTasks = tasks.filter(task => {
                        if (day === 1) return task.id <= 7;
                        if (day === 2) return task.id > 7 && task.id <= 14;
                        if (day === 3) return task.id > 14 && task.id <= 21;
                        if (day === 4) return task.id > 21 && task.id <= 28;
                        if (day === 5) return task.id > 28 && task.id <= 35;
                        return false;
                      });
                      const completedTasks = dayTasks.filter(task => task.completed).length;
                      const totalTasks = dayTasks.length;
                      const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                      
                      return (
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-[#0d0d1f] rounded-full h-2">
                            <div 
                              className="bg-green-400 h-full rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-white">{percentage}%</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Current Day Tasks */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Day {selectedDay} Tasks</h3>
            
            <div className="space-y-4">
              {currentDayTasks.length > 0 ? (
                currentDayTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between p-4 bg-[#1e1e3f] rounded-lg hover:bg-[#2e2e4f] transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                          task.completed 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : 'bg-[#2e2e4f] hover:bg-[#3e3e5f]'
                        }`}
                      >
                        {task.completed && <CheckCircle className="w-3 h-3 text-white" />}
                      </button>
                      <div>
                        <h4 className="text-lg font-semibold text-white">{task.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-[#a0a0c0]">
                          <Clock className="w-4 h-4" />
                          <span>{task.time}</span>
                          <span className={`ml-2 px-2 py-1 rounded text-xs ${
                            task.platform === 'instagram' ? 'bg-pink-500/20 text-pink-400' :
                            task.platform === 'tiktok' ? 'bg-black/20 text-black' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {task.platform}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => editTask(task.id)}
                        className="p-2 text-[#a0a0c0] hover:text-white hover:bg-[#2e2e4f] rounded-lg transition-colors"
                        title="Edit Task"
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete Task"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#a0a0c0] mb-4">No tasks scheduled for Day {selectedDay}</p>
                  <button 
                    onClick={() => setShowAddTaskModal(true)}
                    className="bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white font-semibold py-2 px-6 rounded-lg hover:from-[#7c3aed] hover:to-[#2563eb] transition-all duration-300"
                  >
                    Add Task
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="glass-card rounded-xl p-4 text-center"
              >
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-[#a0a0c0] mb-1">Weekly Progress</p>
                <p className="text-2xl font-bold text-white">68%</p>
                <p className="text-xs text-[#6060a0]">+12% from last week</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-card rounded-xl p-4 text-center"
              >
                <Target className="w-8 h-8 text-[#8b5cf6] mx-auto mb-2" />
                <p className="text-sm text-[#a0a0c0] mb-1">Goals Met</p>
                <p className="text-2xl font-bold text-white">24/30</p>
                <p className="text-xs text-[#6060a0]">4 days remaining</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass-card rounded-xl p-4 text-center"
              >
                <CheckCircle className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-[#a0a0c0] mb-1">Best Day</p>
                <p className="text-2xl font-bold text-white">Day 3</p>
                <p className="text-xs text-[#6060a0]">95% completion</p>
              </motion.div>
            </div>
          </div>

        {/* Task Modal */}
        {showAddTaskModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#0f0f23] rounded-xl p-6 w-full max-w-md border border-[#1e1e3f]">
              <h3 className="text-xl font-bold text-white mb-4">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#a0a0c0] mb-1">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0d0d1f] border border-[#1e1e3f] rounded-lg text-white focus:outline-none focus:border-[#8b5cf6]"
                    placeholder="Enter task title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#a0a0c0] mb-1">
                    Platform
                  </label>
                  <select
                    value={newTask.platform}
                    onChange={(e) => setNewTask({ ...newTask, platform: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0d0d1f] border border-[#1e1e3f] rounded-lg text-white focus:outline-none focus:border-[#8b5cf6]"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#a0a0c0] mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newTask.time}
                    onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0d0d1f] border border-[#1e1e3f] rounded-lg text-white focus:outline-none focus:border-[#8b5cf6]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#a0a0c0] mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newTask.date}
                    onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0d0d1f] border border-[#1e1e3f] rounded-lg text-white focus:outline-none focus:border-[#8b5cf6]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#a0a0c0] mb-1">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0d0d1f] border border-[#1e1e3f] rounded-lg text-white focus:outline-none focus:border-[#8b5cf6] resize-none"
                    rows={3}
                    placeholder="Enter task description (optional)"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddTaskModal(false);
                    setEditingTask(null);
                    setNewTask({ title: '', platform: 'tiktok', time: '09:00', date: '', description: '' });
                  }}
                  className="px-4 py-2 text-[#a0a0c0] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingTask ? updateTask : addTask}
                  className="px-4 py-2 bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white font-semibold rounded-lg hover:from-[#7c3aed] hover:to-[#2563eb] transition-all duration-300"
                >
                  {editingTask ? 'Update Task' : 'Add Task'}
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
