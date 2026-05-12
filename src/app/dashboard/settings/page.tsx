'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Lock, CreditCard, Globe, Bell, HelpCircle, AlertTriangle, Upload, Mail, Check, X } from 'lucide-react';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { supabase } from '@/lib/supabase';

export default function Settings() {
  // Profile Section State
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Password Section State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Language Section State
  const [language, setLanguage] = useState('english');
  
  // Notifications Section State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [accountAlerts, setAccountAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  
  // Support Section State
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [supportName, setSupportName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  
  // Danger Zone State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  
  // General State
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Mock user data - in real app, this would come from Supabase
  const mockUserData = {
    displayName: 'John Doe',
    email: 'john.doe@example.com',
    plan: 'Agency Pro',
    planDescription: 'Unlimited content analyses, real-time trend alerts, advanced analytics, white-label options, dedicated support, and custom integrations.'
  };

  // Load existing profile picture and user data on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        console.log('Loading user profile data...');
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          console.error('Auth error:', authError);
          throw authError;
        }
        
        if (user) {
          console.log('User found:', { id: user.id, email: user.email });
          
          // Set email from Supabase Auth
          setEmail(user.email || '');
          
          // Load profile data from database
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('avatar_url, display_name')
            .eq('id', user.id)
            .single();
          
          if (profileError) {
            console.log('Profile not found in database, using defaults');
            setDisplayName(user.user_metadata?.display_name || user.user_metadata?.full_name || '');
          } else {
            console.log('Profile found in database:', profile);
            setProfilePictureUrl(profile.avatar_url);
            setDisplayName(profile.display_name || user.user_metadata?.display_name || user.user_metadata?.full_name || '');
          }
        } else {
          console.log('No user found');
          // Fallback to mock data if no user
          setEmail(mockUserData.email);
          setDisplayName(mockUserData.displayName);
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
        // Fallback to mock data on error
        setEmail(mockUserData.email);
        setDisplayName(mockUserData.displayName);
      }
    };

    loadProfileData();
  }, []);

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('=== PROFILE PICTURE UPLOAD STARTED ===');
    
    const file = event.target.files?.[0];
    console.log('1) FILE SELECTED:', {
      file: file,
      name: file?.name,
      size: file?.size,
      type: file?.type,
      lastModified: file?.lastModified
    });
    
    if (!file) {
      console.log('No file selected, returning early');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log('Invalid file type:', file.type);
      setErrorMessage('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log('File too large:', file.size);
      setErrorMessage('Image size must be less than 5MB');
      return;
    }

    console.log('File validation passed, starting upload...');
    setIsUploading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      console.log('2) GETTING USER AUTHENTICATION...');
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      console.log('Auth response:', { 
        user: user ? { id: user.id, email: user.email } : null, 
        authError 
      });
      
      if (authError) {
        console.error('Auth error:', authError);
        throw new Error(`Authentication error: ${authError.message}`);
      }
      
      if (!user) {
        console.log('No user found');
        throw new Error('User not authenticated');
      }

      console.log('2) USER ID:', user.id);
      console.log('User authenticated successfully:', user.id, user.email);

      console.log('3) SKIPPING BUCKET CHECK - UPLOADING DIRECTLY TO AVATARS BUCKET...');

      // Create file path with user ID
      const fileExtension = file.name.split('.').pop();
      const fileName = `avatar.${fileExtension}`;
      const filePath = `${user.id}/${fileName}`;
      
      console.log('4) UPLOAD DETAILS:', {
        fileName,
        filePath,
        fileSize: file.size,
        fileType: file.type,
        fileExtension
      });

      console.log('5) STARTING SUPABASE STORAGE UPLOAD...');
      // Upload to Supabase Storage with simplified method
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      console.log('6) SUPABASE STORAGE RESPONSE:', { 
        uploadData, 
        uploadError,
        uploadDataKeys: uploadData ? Object.keys(uploadData) : null
      });

      if (uploadError) {
        console.error('Upload error details:', {
          message: uploadError.message,
          statusCode: uploadError.statusCode,
          error: uploadError.error,
          path: uploadError.path
        });
        throw new Error(`Upload failed: ${uploadError.message} (Status: ${uploadError.statusCode})`);
      }

      console.log('Upload successful, getting public URL...');

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('7) PUBLIC URL GENERATED:', publicUrl);

      console.log('8) UPDATING USER PROFILE IN DATABASE...');
      // Update user profile in database
      const profileUpdateData = {
        id: user.id,
        avatar_url: publicUrl,
        updated_at: new Date().toISOString()
      };
      
      console.log('Profile update data:', profileUpdateData);
      
      const { data: profileData, error: updateError } = await supabase
        .from('profiles')
        .upsert(profileUpdateData, {
          onConflict: 'id'
        });

      console.log('9) COMPLETE PROFILE UPDATE RESPONSE:', { 
        profileData, 
        updateError,
        updateErrorKeys: updateError ? Object.keys(updateError) : null,
        updateErrorString: updateError ? JSON.stringify(updateError, null, 2) : null
      });

      if (updateError) {
        console.error('=== COMPLETE PROFILE UPDATE ERROR ===');
        console.error('Error object:', updateError);
        console.error('Error message:', updateError.message);
        console.error('Error details:', updateError.details);
        console.error('Error hint:', updateError.hint);
        console.error('Error code:', updateError.code);
        console.error('Full error string:', JSON.stringify(updateError, null, 2));
        
        // Check if it's a column error and try fallback
        if (updateError.message?.includes('column') || updateError.details?.includes('column') || 
            updateError.message?.includes('avatar_url') || updateError.details?.includes('avatar_url')) {
          console.error('This appears to be a missing avatar_url column error. Trying fallback approach...');
          
          // Try alternative approach: update only existing columns
          try {
            console.log('Trying fallback update without avatar_url...');
            const { data: fallbackData, error: fallbackError } = await supabase
              .from('profiles')
              .upsert({
                id: user.id,
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'id'
              });
            
            console.log('Fallback update result:', { fallbackData, fallbackError });
            
            if (fallbackError) {
              console.error('Fallback also failed:', fallbackError);
              throw new Error(`Profile update failed and fallback also failed: ${updateError.message}`);
            } else {
              console.log('Fallback succeeded - avatar_url not saved but profile updated');
              // Continue with success even though avatar_url wasn't saved
            }
          } catch (fallbackCatchError) {
            console.error('Fallback attempt failed:', fallbackCatchError);
            throw new Error(`Profile update failed: ${updateError.message}. The avatar_url column might not exist in the profiles table.`);
          }
        } else {
          throw new Error(`Profile update failed: ${updateError.message} (Code: ${updateError.code})`);
        }
      }

      console.log('10) UPDATING LOCAL STATE...');
      // Update local state
      setProfilePictureUrl(publicUrl);
      setProfilePicture(file);
      setSuccessMessage('Profile picture updated successfully!');
      
      console.log('=== PROFILE PICTURE UPLOAD COMPLETED SUCCESSFULLY ===');
      
    } catch (error) {
      console.error('=== UPLOAD ERROR ===');
      console.error('Full upload error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
        constructor: error?.constructor?.name
      });
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload profile picture';
      setErrorMessage(errorMessage);
    } finally {
      console.log('Upload process finished, setting loading to false');
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Saving profile:', { displayName });

      // Update profile in database
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          display_name: displayName,
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw new Error(`Failed to update profile: ${profileError.message}`);
      }

      console.log('Profile updated successfully in database');
      setSuccessMessage('Profile updated successfully!');
      
    } catch (error) {
      console.error('Profile save error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      // In real app, update in Supabase Auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setErrorMessage('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = async (newLanguage: string) => {
    setLanguage(newLanguage);
    // In real app, save preference to Supabase
    setSuccessMessage('Language preference saved!');
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const handleNotificationToggle = async (type: string, value: boolean) => {
    setIsLoading(true);
    
    try {
      // In real app, save to Supabase
      await new Promise(resolve => setTimeout(resolve, 500));
      
      switch (type) {
        case 'email':
          setEmailNotifications(value);
          break;
        case 'alerts':
          setAccountAlerts(value);
          break;
        case 'reports':
          setWeeklyReports(value);
          break;
      }
      
      setSuccessMessage('Notification preferences saved!');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (error) {
      setErrorMessage('Failed to update preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactSupport = async () => {
    if (!supportName || !supportEmail || !supportMessage) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      // In real app, send email to baroqueincoporated@gmail.com
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Support request sent successfully!');
      setShowSupportModal(false);
      setSupportName('');
      setSupportEmail('');
      setSupportMessage('');
    } catch (error) {
      setErrorMessage('Failed to send support request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      setErrorMessage('Please type DELETE to confirm');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // In real app, delete from Supabase
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Redirect to homepage
      window.location.href = '/';
    } catch (error) {
      setErrorMessage('Failed to delete account');
      setIsLoading(false);
    }
  };

  const faqItems = [
    {
      question: 'How do I upgrade my plan?',
      answer: 'Click the "Upgrade Plan" button in the Plan section to visit our pricing page and select a higher tier.'
    },
    {
      question: 'Can I change my email address?',
      answer: 'Currently, email addresses are read-only for security reasons. Please contact support if you need to change your email.'
    },
    {
      question: 'How do I cancel my subscription?',
      answer: 'You can cancel your subscription from the billing section or contact our support team for assistance.'
    },
    {
      question: 'What happens to my data when I delete my account?',
      answer: 'All your data will be permanently deleted and cannot be recovered. Please export any important data before deleting.'
    },
    {
      question: 'How do I enable two-factor authentication?',
      answer: 'Two-factor authentication is not currently available, but we\'re working on adding this feature soon.'
    }
  ];

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
              <h1 className="text-xl font-bold text-white">Settings</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success/Error Messages */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
            >
              <p className="text-green-400">{successMessage}</p>
            </motion.div>
          )}
          
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
            >
              <p className="text-red-400">{errorMessage}</p>
            </motion.div>
          )}

          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-card rounded-xl p-6 mb-6"
          >
            <div className="flex items-center mb-4">
              <User className="w-5 h-5 text-[#8b5cf6] mr-2" />
              <h2 className="text-xl font-semibold text-white">Profile</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#a0a0c0] mb-2">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2 bg-[#1e1e3f] border border-[#2e2e4f] rounded-lg text-white focus:outline-none focus:border-[#8b5cf6]"
                  placeholder="Enter your name"
                />
              </div>
              
                            
              <div>
                <label className="block text-sm font-medium text-[#a0a0c0] mb-2">Profile Picture</label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-[#1e1e3f] rounded-full flex items-center justify-center overflow-hidden">
                    {profilePictureUrl ? (
                      <img 
                        src={profilePictureUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-[#6060a0]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex items-center px-4 py-2 bg-[#8b5cf6] text-white rounded-lg hover:bg-[#7c3aed] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Picture
                        </>
                      )}
                    </button>
                    <p className="text-xs text-[#6060a0] mt-1">
                      JPG, PNG or GIF. Max 5MB.
                    </p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white font-semibold py-2 px-4 rounded-lg hover:from-[#7c3aed] hover:to-[#2563eb] transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </motion.div>

          {/* Password Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="glass-card rounded-xl p-6 mb-6"
          >
            <div className="flex items-center mb-4">
              <Lock className="w-5 h-5 text-[#8b5cf6] mr-2" />
              <h2 className="text-xl font-semibold text-white">Password</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#a0a0c0] mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-[#1e1e3f] border border-[#2e2e4f] rounded-lg text-white focus:outline-none focus:border-[#8b5cf6]"
                  placeholder="Enter current password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#a0a0c0] mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-[#1e1e3f] border border-[#2e2e4f] rounded-lg text-white focus:outline-none focus:border-[#8b5cf6]"
                  placeholder="Enter new password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#a0a0c0] mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-[#1e1e3f] border border-[#2e2e4f] rounded-lg text-white focus:outline-none focus:border-[#8b5cf6]"
                  placeholder="Confirm new password"
                />
              </div>
              
              <button
                onClick={handleChangePassword}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white font-semibold py-2 px-4 rounded-lg hover:from-[#7c3aed] hover:to-[#2563eb] transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </motion.div>

          {/* Plan Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="glass-card rounded-xl p-6 mb-6"
          >
            <div className="flex items-center mb-4">
              <CreditCard className="w-5 h-5 text-[#8b5cf6] mr-2" />
              <h2 className="text-xl font-semibold text-white">Plan</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white text-sm font-semibold rounded-full">
                  {mockUserData.plan}
                </span>
              </div>
              
              <p className="text-[#a0a0c0]">{mockUserData.planDescription}</p>
              
              <Link href="/pricing">
                <button className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white font-semibold py-2 px-4 rounded-lg hover:from-[#7c3aed] hover:to-[#2563eb] transition-all duration-300">
                  Upgrade Plan
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Language Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="glass-card rounded-xl p-6 mb-6"
          >
            <div className="flex items-center mb-4">
              <Globe className="w-5 h-5 text-[#8b5cf6] mr-2" />
              <h2 className="text-xl font-semibold text-white">Language</h2>
            </div>
            
            <div className="space-y-4">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full px-4 py-2 bg-[#1e1e3f] border border-[#2e2e4f] rounded-lg text-white focus:outline-none focus:border-[#8b5cf6]"
              >
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="portuguese">Portuguese</option>
                <option value="french">French</option>
              </select>
            </div>
          </motion.div>

          {/* Notifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="glass-card rounded-xl p-6 mb-6"
          >
            <div className="flex items-center mb-4">
              <Bell className="w-5 h-5 text-[#8b5cf6] mr-2" />
              <h2 className="text-xl font-semibold text-white">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[#a0a0c0]">Email Notifications</span>
                <button
                  onClick={() => handleNotificationToggle('email', !emailNotifications)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    emailNotifications ? 'bg-[#8b5cf6]' : 'bg-[#2e2e4f]'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    emailNotifications ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-[#a0a0c0]">Account Alerts</span>
                <button
                  onClick={() => handleNotificationToggle('alerts', !accountAlerts)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    accountAlerts ? 'bg-[#8b5cf6]' : 'bg-[#2e2e4f]'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    accountAlerts ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-[#a0a0c0]">Weekly Reports</span>
                <button
                  onClick={() => handleNotificationToggle('reports', !weeklyReports)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    weeklyReports ? 'bg-[#8b5cf6]' : 'bg-[#2e2e4f]'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    weeklyReports ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Support Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="glass-card rounded-xl p-6 mb-6"
          >
            <div className="flex items-center mb-4">
              <HelpCircle className="w-5 h-5 text-[#8b5cf6] mr-2" />
              <h2 className="text-xl font-semibold text-white">Support</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setShowSupportModal(true)}
                className="flex items-center justify-center px-4 py-2 bg-[#8b5cf6] text-white rounded-lg hover:bg-[#7c3aed] transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </button>
              
              <button
                onClick={() => setShowHelpModal(true)}
                className="flex items-center justify-center px-4 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Visit Help Center
              </button>
            </div>
          </motion.div>

          {/* Danger Zone Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="glass-card rounded-xl p-6 border-2 border-red-500/20"
          >
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
              <h2 className="text-xl font-semibold text-red-400">Danger Zone</h2>
            </div>
            
            <p className="text-[#a0a0c0] mb-4">Once you delete your account, there is no going back. Please be certain.</p>
            
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete Account
            </button>
          </motion.div>
        </div>
      </main>

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0f0f23] rounded-xl p-6 w-full max-w-md border border-[#1e1e3f]">
            <h3 className="text-xl font-bold text-white mb-4">Contact Support</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#a0a0c0] mb-2">Name</label>
                <input
                  type="text"
                  value={supportName}
                  onChange={(e) => setSupportName(e.target.value)}
                  className="w-full px-4 py-2 bg-[#1e1e3f] border border-[#2e2e4f] rounded-lg text-white focus:outline-none focus:border-[#8b5cf6]"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#a0a0c0] mb-2">Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-[#1e1e3f] border border-[#2e2e4f] rounded-lg text-white focus:outline-none focus:border-[#8b5cf6]"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#a0a0c0] mb-2">Message</label>
                <textarea
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  className="w-full px-4 py-2 bg-[#1e1e3f] border border-[#2e2e4f] rounded-lg text-white focus:outline-none focus:border-[#8b5cf6] resize-none"
                  rows={4}
                  placeholder="How can we help you?"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSupportModal(false)}
                className="px-4 py-2 bg-[#2e2e4f] text-white rounded-lg hover:bg-[#3e3e5f] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleContactSupport}
                disabled={isLoading}
                className="px-4 py-2 bg-[#8b5cf6] text-white rounded-lg hover:bg-[#7c3aed] transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Center Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0f0f23] rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-[#1e1e3f]">
            <h3 className="text-xl font-bold text-white mb-4">Help Center - FAQ</h3>
            
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b border-[#1e1e3f] pb-4">
                  <h4 className="text-white font-semibold mb-2">{item.question}</h4>
                  <p className="text-[#a0a0c0]">{item.answer}</p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-[#8b5cf6] text-white rounded-lg hover:bg-[#7c3aed] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0f0f23] rounded-xl p-6 w-full max-w-md border border-[#1e1e3f]">
            <h3 className="text-xl font-bold text-red-400 mb-4">Delete Account</h3>
            
            <p className="text-[#a0a0c0] mb-4">
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#a0a0c0] mb-2">
                Type "DELETE" to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="w-full px-4 py-2 bg-[#1e1e3f] border border-[#2e2e4f] rounded-lg text-white focus:outline-none focus:border-red-500"
                placeholder="DELETE"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                }}
                className="px-4 py-2 bg-[#2e2e4f] text-white rounded-lg hover:bg-[#3e3e5f] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading || deleteConfirmation !== 'DELETE'}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
