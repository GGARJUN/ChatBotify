"use client";

import { useAuth } from '@/context/AuthContext';
import BotList from '@/components/botComponents/BotList';
import CreateBot from '@/components/botComponents/CreateBot';
import { useEffect, useState } from 'react';
import { getUserProfile } from '@/lib/api/users';

export default function DashBoard() {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0); // Used to force refresh BotList
    const [formData, setFormData] = useState({
      fullName: '',
      email: '',
    });
    const [isLoading, setIsLoading] = useState(true);

  const handleBotCreated = () => {
    setRefreshKey(prev => prev + 1); // Increment to trigger refresh
  };

    const fetchUserProfile = async () => {
      try {
        if (!user?.userId) {
          toast.error('User not authenticated.');
          setIsLoading(false);
          return;
        }
  
        const token = localStorage.getItem('idToken');
        if (!token) {
          toast.error('Session expired. Please login again.');
          setIsLoading(false);
          return;
        }
  
        const userProfile = await getUserProfile(user.userId, token);
        console.log(userProfile);
  
        const fullName = `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim();
        setFormData({
          fullName: fullName || 'Not provided',
          email: userProfile.email || 'Not provided',
        });
      } catch (error) {
        toast.error('Failed to load profile. Please try again.');
        console.error('Profile fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    useEffect(() => {
      fetchUserProfile();
    }, [user]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome back, {formData.fullName} !</h2>
          <p className="text-sm text-slate-500 mt-1">Your chatbot automation at a glance</p>
        </div>
        <CreateBot onCreate={handleBotCreated} />
      </div>
      <BotList key={refreshKey} /> {/* Key change forces remount */}
    </div>
  );
}