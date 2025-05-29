'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import EditBotDialog from './EditBotDialog';
import { updateBot } from '@/lib/api/bots';
import { FaEye, FaRobot } from 'react-icons/fa';
import { Delete, Edit } from 'lucide-react';
import { FaTrash } from 'react-icons/fa6';


export default function BotTable({ bots, onBotsUpdate }) {
  const [editOpen, setEditOpen] = useState(false);
  const [selectedBot, setSelectedBot] = useState(null);
  const { user } = useAuth();

  const handleEditClick = (bot) => {
    setSelectedBot(bot);
    setEditOpen(true);
  };

  const handleUpdate = async (botId, data) => {
    try {
      const token = localStorage.getItem('idToken');
      if (!token) throw new Error('Authentication required');

      const updatedBot = await updateBot(botId, data, token);

      // Optimistically update UI
      if (onBotsUpdate) {
        onBotsUpdate((prev) =>
          prev.map((bot) => (bot.id === updatedBot.id ? updatedBot : bot)
          ))
      }

      setEditOpen(false);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bots && bots.length > 0 ? (
          bots.map((bot) => (
            <div
              key={bot.id}
              className="bg-white p-5 shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`bg-blue-200/50 rounded-full w-14 h-14 flex justify-center items-center ${bot.status === 'ACTIVE'
                    ? 'text-blue-500 bg-blue-200/50'
                    : 'text-red-500 bg-red-200/50'
                    }`}
                >
                  <FaRobot className="w-8 h-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-sm md:text-base text-slate-900 truncate">
                    {bot.name}
                  </h2>
                  <p className="text-slate-400 text-xs md:text-sm">
                    {new Date(bot.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap ${bot.status === 'ACTIVE'
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
                    className="text-blue-600 font-medium flex items-center gap-1 hover:underline focus:outline-none"
                    aria-label="Edit bot"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    className="text-slate-600 font-medium flex items-center gap-1 hover:underline focus:outline-none"
                    aria-label="Preview bot"
                  >
                    <FaEye size={14} />
                    Preview
                  </button>
                  <button
                    className="text-red-600 font-medium flex items-center gap-1 hover:underline focus:outline-none"
                    aria-label="Delete bot"
                  >
                    <FaTrash size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='flex justify-center items-center gap-5'>
            {/* Skeleton cards */}
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-slate-200  animate-pulse w-80 rounded-xl border border-gray-200 p-5 h-40"
              ></div>
            ))}
          </div>
        )}
      </div>
      {/* <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-slate-500 font-bold">NAME</TableHead>
            <TableHead className="text-slate-500 font-bold">DESCRIPTION</TableHead>
            <TableHead className="text-slate-500 font-bold">STATUS</TableHead>
            <TableHead className="text-slate-500 font-bold">CREATED</TableHead>
            <TableHead className="text-slate-500 font-bold text-right">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bots && bots.length > 0 ? (
            bots.map((bot) => (
              <TableRow key={bot.id}>
                <TableCell className="text-slate-600 font-medium">{bot.name}</TableCell>
                <TableCell>{bot.description}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-md text-sm font-medium ${
                      bot.status === 'ACTIVE'
                        ? 'bg-green-300/30 text-green-500'
                        : bot.status === 'DRAFT'
                        ? 'bg-yellow-300/30 text-yellow-500'
                        : 'bg-red-300/30 text-red-500'
                    }`}
                  >
                    {bot.status}
                  </span>
                </TableCell>
                <TableCell className="text-slate-500 font-semibold">
                  {new Date(bot.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-4">
                    <Button variant="ghost" size="sm" onClick={() => handleEditClick(bot)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500">
                No bots found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table> */}

      {/* Edit Dialog */}
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