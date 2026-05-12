'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Globe, User, X } from 'lucide-react';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { supabase } from '@/lib/supabase';

interface CreatorAccount {
  id: string;
  creator_name: string;
  tiktok_username: string;
  target_country: string;
  content_niche: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export default function AccountVault() {
  const [accounts, setAccounts] = useState<CreatorAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    creator_name: '',
    tiktok_username: '',
    target_country: '',
    content_niche: ''
  });

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setMessage({ type: 'error', text: 'Please log in to view accounts' });
        return;
      }

      const { data, error } = await supabase
        .from('creator_accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch error details:', error);
        setMessage({ type: 'error', text: `Failed to fetch accounts: ${error.message}` });
        return;
      }

      setAccounts(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleEditAccount = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    if (account) {
      setFormData({
        creator_name: account.creator_name,
        tiktok_username: account.tiktok_username,
        target_country: account.target_country,
        content_niche: account.content_niche
      });
      setEditingAccount(accountId);
      setShowModal(true);
    }
  };

  const handleAddAccount = async () => {
    if (!formData.creator_name || !formData.tiktok_username || !formData.target_country || !formData.content_niche) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setMessage({ type: 'error', text: 'Please log in to add accounts' });
        return;
      }

      const accountData = {
        user_id: user.id,
        creator_name: formData.creator_name,
        tiktok_username: formData.tiktok_username,
        target_country: formData.target_country,
        content_niche: formData.content_niche
      };

      if (editingAccount) {
        const { error } = await supabase
          .from('creator_accounts')
          .update(accountData)
          .eq('id', editingAccount);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Account updated successfully' });
      } else {
        const { error } = await supabase
          .from('creator_accounts')
          .insert(accountData);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Account added successfully' });
      }

      setShowModal(false);
      resetForm();
      fetchAccounts();
    } catch (error: any) {
      const errorDetails = {
        message: (error as any)?.message || 'Unknown error',
        code: (error as any)?.code || 'Unknown',
        details: (error as any)?.details || null,
        hint: (error as any)?.hint || null,
        fullError: error
      };
      
      console.error('Save error full details:', JSON.stringify(errorDetails, null, 2));
      setMessage({ 
        type: 'error', 
        text: `${editingAccount ? 'Failed to update account' : 'Failed to add account'}: ${errorDetails.message} (Code: ${errorDetails.code})` 
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      creator_name: '',
      tiktok_username: '',
      target_country: '',
      content_niche: ''
    });
    setEditingAccount(null);
  };

  const filteredAccounts = accounts.filter(account =>
    (account.creator_name?.toLowerCase() ?? '').includes(searchQuery?.toLowerCase() ?? '') ||
    (account.tiktok_username?.toLowerCase() ?? '').includes(searchQuery?.toLowerCase() ?? '') ||
    (account.content_niche?.toLowerCase() ?? '').includes(searchQuery?.toLowerCase() ?? '')
  );

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
              <h1 className="text-xl font-bold text-white">Account Vault</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Navigation */}
          <DashboardNav currentPage="vault" />

          {/* Header Actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search accounts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-[#1e1e3f] border border-[#2e2e4f] rounded-lg text-white placeholder-[#6060a0] focus:outline-none focus:border-[#8b5cf6] w-64"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6060a0]" />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-[#1e1e3f] border border-[#2e2e4f] rounded-lg text-[#a0a0c0] hover:text-white hover:bg-[#2e2e4f] transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center space-x-2 bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white font-semibold py-2 px-6 rounded-lg hover:from-[#7c3aed] hover:to-[#2563eb] transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              <span>Add Account</span>
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-[#8b5cf6]/20 rounded-lg">
                  <User className="w-5 h-5 text-[#8b5cf6]" />
                </div>
                <span className="text-sm text-green-400">+12%</span>
              </div>
              <p className="text-2xl font-bold text-white">{accounts.length}</p>
              <p className="text-sm text-[#a0a0c0]">Total Accounts</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-card rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-[#06b6d4]/20 rounded-lg">
                  <span className="w-5 h-5 text-[#06b6d4] flex items-center justify-center font-bold text-xs">IG</span>
                </div>
                <span className="text-sm text-green-400">+8%</span>
              </div>
              <p className="text-2xl font-bold text-white">{accounts.length}</p>
              <p className="text-sm text-[#a0a0c0]">TikTok Accounts</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-card rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-[#10b981]/20 rounded-lg">
                  <Globe className="w-5 h-5 text-[#10b981]" />
                </div>
                <span className="text-sm text-green-400">+5%</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {new Set(accounts.map(a => a.target_country)).size}
              </p>
              <p className="text-sm text-[#a0a0c0]">Target Markets</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass-card rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-[#f59e0b]/20 rounded-lg">
                  <Filter className="w-5 h-5 text-[#f59e0b]" />
                </div>
                <span className="text-sm text-green-400">+15%</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {new Set(accounts.map(a => a.content_niche)).size}
              </p>
              <p className="text-sm text-[#a0a0c0]">Content Niches</p>
            </motion.div>
          </div>

          {/* Success/Error Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/50'
              }`}
            >
              {message.text}
            </motion.div>
          )}

          {/* Accounts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-[#a0a0c0]">Loading accounts...</p>
              </div>
            ) : filteredAccounts.length > 0 ? (
              filteredAccounts.map((account) => (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#000000] to-[#FFD700] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">TT</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{account.creator_name}</h3>
                        <p className="text-sm text-[#a0a0c0]">@{account.tiktok_username}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#a0a0c0]">Target Market</span>
                      <span className="text-sm font-medium text-white">{account.target_country}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#a0a0c0]">Content Niche</span>
                      <span className="text-sm font-medium text-white">{account.content_niche}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-6">
                    <button
                      onClick={() => handleEditAccount(account.id)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-[#1e1e3f] border border-[#2e2e4f] rounded-lg py-2 text-[#a0a0c0] hover:text-white hover:bg-[#2e2e4f] transition-colors"
                    >
                      <span>Edit</span>
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-[#a0a0c0] mb-4">No accounts found</p>
                <button
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                  className="bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white font-semibold py-2 px-6 rounded-lg hover:from-[#7c3aed] hover:to-[#2563eb] transition-all duration-300"
                >
                  Add Your First Account
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add/Edit Account Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-[#0d0d1f] rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {editingAccount ? 'Edit Account' : 'Add New Account'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-[#a0a0c0] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Creator Name</label>
                <input
                  type="text"
                  value={formData.creator_name}
                  onChange={(e) => setFormData({ ...formData, creator_name: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1e1e3f] border border-[#2e2e4f] rounded-lg text-white placeholder-[#6060a0] focus:outline-none focus:border-[#8b5cf6]"
                  placeholder="Enter creator name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">TikTok Username</label>
                <input
                  type="text"
                  value={formData.tiktok_username}
                  onChange={(e) => setFormData({ ...formData, tiktok_username: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1e1e3f] border border-[#2e2e4f] rounded-lg text-white placeholder-[#6060a0] focus:outline-none focus:border-[#8b5cf6]"
                  placeholder="@username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Target Market Country</label>
                <input
                  type="text"
                  value={formData.target_country}
                  onChange={(e) => setFormData({ ...formData, target_country: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1e1e3f] border border-[#2e2e4f] rounded-lg text-white placeholder-[#6060a0] focus:outline-none focus:border-[#8b5cf6]"
                  placeholder="e.g., United States"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Content Niche</label>
                <input
                  type="text"
                  value={formData.content_niche}
                  onChange={(e) => setFormData({ ...formData, content_niche: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1e1e3f] border border-[#2e2e4f] rounded-lg text-white placeholder-[#6060a0] focus:outline-none focus:border-[#8b5cf6]"
                  placeholder="e.g., Fashion, Tech, Lifestyle"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 bg-[#1e1e3f] border border-[#2e2e4f] rounded-lg text-[#a0a0c0] hover:text-white hover:bg-[#2e2e4f] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAccount}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white font-semibold py-2 px-6 rounded-lg hover:from-[#7c3aed] hover:to-[#2563eb] transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingAccount ? 'Update Account' : 'Add Account')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
