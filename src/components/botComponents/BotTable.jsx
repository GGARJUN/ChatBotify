'use client';

import { useState } from 'react';
import { FaRobot, FaEye } from 'react-icons/fa';
import { Edit } from 'lucide-react';
import EditBotDialog from './EditBotDialog';
import Link from 'next/link';
import { toast } from 'sonner';
import { updateBot } from '@/lib/api/bots';
import { useAuth } from '@/context/AuthContext';
import { SiSpeedtest } from 'react-icons/si';
import Widget from './Widget';

export default function BotTable({ bots = [], onBotsUpdate, loading = false }) {
  const [selectedBot, setSelectedBot] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const { user } = useAuth();

  const handleEditClick = (bot) => {
    setSelectedBot(bot);
    setEditOpen(true);
  };

  const handleUpdate = async (botId, data) => {
    setProcessingId(botId);
    try {
      const token = localStorage.getItem('idToken');
      if (!token) {
        toast.error('Session expired. Please login again.');
        return;
      }

      // Optimistic UI update
      const optimisticBot = {
        ...data,
        id: botId,
        updatedAt: new Date().toISOString(),
      };
      onBotsUpdate(optimisticBot);

      // Server update
      const updatedBot = await updateBot(botId, data, token);
      onBotsUpdate(updatedBot);

      setEditOpen(false);
      toast.success('Bot updated successfully');
    } catch (error) {
      console.error('Error updating bot:', error);
      toast.error(error.message || 'Failed to update bot');
      // Revert optimistic update on error
      onBotsUpdate(bots.find((bot) => bot.id === botId));
    } finally {
      setProcessingId(null);
    }
  };

  // Toggle chat widget for a specific bot
  const toggleChat = (bot) => {
    setSelectedBot(selectedBot && selectedBot.id === bot.id ? null : bot);
  };

  const SkeletonCard = () => (
    <div className="bg-white p-5 shadow-lg rounded-xl border border-gray-100 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="rounded-full w-14 h-14 bg-gray-200"></div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-6 w-16 bg-gray-200 rounded-md"></div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="flex items-center justify-start gap-6 mt-4">
        <div className="h-5 w-12 bg-gray-200 rounded"></div>
        <div className="h-5 w-14 bg-gray-200 rounded"></div>
        <div className="h-5 w-12 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <SkeletonCard key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  if (!bots || bots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center max-w-md">
          <div className="mx-auto h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">
            <FaRobot className="text-gray-700 h-10 w-10" />
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No bots created</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first bot.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bots.map((item) => {
          const bot = item.bot || item;
          const isProcessing = processingId === bot.id;

          return (
            <div
              key={bot.id}
              className="bg-white p-5 shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`rounded-full w-14 h-14 flex justify-center items-center ${
                    bot.status === 'ACTIVE' ? 'bg-blue-200/50 text-blue-500' : 'bg-red-200/50 text-red-500'
                  }`}
                >
                  <FaRobot className="w-8 h-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-sm md:text-base text-slate-900 truncate">{bot.name}</h2>
                  <p className="text-slate-400 text-xs md:text-sm">
                    {new Date(bot.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
                    bot.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-700'
                      : bot.status === 'DRAFT'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {bot.status}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-slate-700 line-clamp-2">{bot.description}</p>
                <div className="flex items-center justify-start gap-6 mt-4">
                  <button
                    onClick={() => handleEditClick(bot)}
                    disabled={isProcessing}
                    className={`text-blue-600 font-medium flex cursor-pointer items-center gap-1 hover:underline focus:outline-none ${
                      isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    aria-label="Edit bot"
                  >
                    {isProcessing ? (
                      <span className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></span>
                    ) : (
                      <Edit size={14} />
                    )}
                    Edit
                  </button>
                  <Link href={`/clients/${user.clientId}/bots/${bot.id}`}>
                    <button
                      className="text-slate-600 cursor-pointer font-medium flex items-center gap-1 hover:underline focus:outline-none"
                      aria-label="Preview bot"
                    >
                      <FaEye size={14} />
                      Preview
                    </button>
                  </Link>
                  <button
                    onClick={() => toggleChat(bot)}
                    className="text-green-600 cursor-pointer font-medium flex items-center gap-1 hover:underline focus:outline-none"
                    aria-label="Test bot"
                  >
                    <SiSpeedtest size={14} />
                    Test Bot
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedBot && (
        <Widget
          onClose={() => setSelectedBot(null)}
          botId={selectedBot.id}
          botName={selectedBot.name}
          clientId={user.clientId}
        />
      )}

      {selectedBot && (
        <EditBotDialog
          bot={selectedBot}
          open={editOpen}
          onOpenChange={setEditOpen}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
}