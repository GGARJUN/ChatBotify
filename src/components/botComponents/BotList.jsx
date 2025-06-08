
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getBots } from '@/lib/api/bots';
import { useAuth } from '@/context/AuthContext';
import { FaFileAlt, FaRobot, FaUsers } from 'react-icons/fa';
import { getDocuments } from '@/lib/api/documents';
import BotTable from './BotTable';

export default function BotList() {
  const router = useRouter();
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);

  const fetchBots = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('idToken');
      if (!token || !user) {
        router.push('/auth/login');
        return;
      }

      const response = await getBots(token);
      const fetchedBots = Array.isArray(response) ? response : [];

      // Normalize bot data to handle both direct and nested bot objects
      const normalizedBots = fetchedBots.map((item) => ({
        id: item.id || item.bot?.id,
        name: item.name || item.bot?.name,
        description: item.description || item.bot?.description,
        status: item.status || item.bot?.status,
        createdAt: item.createdAt || item.bot?.createdAt,
        updatedAt: item.updatedAt || item.bot?.updatedAt,
      }));

      const sortedBots = normalizedBots.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });

      setBots(sortedBots);
    } catch (error) {
      console.error('Error fetching bots:', error.message);
      toast.error('Failed to load bots');
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('idToken');
      if (!token || !user) {
        router.push('/auth/login');
        return;
      }

      const data = await getDocuments(token);
      setDocuments(data || []);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      toast.error('Failed to load documents. Please try again.');
    }
  };

  const handleBotUpdate = (updatedBot) => {
    console.log('Updating bot in BotList:', updatedBot); // Debug log
    setBots((prevBots) => {
      const newBots = prevBots.map((bot) =>
        bot.id === updatedBot.id ? { ...bot, ...updatedBot } : bot
      );
      console.log('New bots state:', newBots); // Debug log
      return newBots;
    });
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchBots(), fetchDocuments()]);
    };
    loadData();
  }, [user, router]);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-md flex items-center gap-4 hover:shadow-lg transition-shadow">
          <div className="bg-blue-200/50 rounded-full w-14 h-14 flex justify-center items-center">
            <FaRobot className="text-blue-600 w-8 h-8" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-slate-900">{bots.length}</h2>
            <p className="text-sm font-medium text-slate-700">Active Bots</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md flex items-center gap-4 hover:shadow-lg transition-shadow">
          <div className="bg-green-200/50 rounded-full w-14 h-14 flex justify-center items-center">
            <FaFileAlt className="text-green-600 w-8 h-8" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-slate-900">{documents.length}</h2>
            <p className="text-sm font-medium text-slate-700">Total Documents</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md flex items-center gap-4 hover:shadow-lg transition-shadow">
          <div className="bg-yellow-200/50 rounded-full w-14 h-14 flex justify-center items-center">
            <FaUsers className="text-yellow-600 w-8 h-8" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-slate-900">17</h2>
            <p className="text-sm font-medium text-slate-700">Team Members</p>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4">
          <h3 className="text-2xl font-semibold text-[#1b0b3b]">Your Recent Chatbots</h3>
          <p className="text-slate-500 mt-1">Manage and create chatbots for your customers</p>
        </div>
        <BotTable bots={bots} loading={loading} onBotsUpdate={handleBotUpdate} />
      </div>
    </div>
  );
}