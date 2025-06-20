

// 'use client';

// import { useState } from 'react';
// import { FaRobot, FaEye } from 'react-icons/fa';
// import { Edit } from 'lucide-react';
// import EditBotDialog from './EditBotDialog';
// import Link from 'next/link';
// import { toast } from 'sonner';
// import { updateBot } from '@/lib/api/bots';
// import { useAuth } from '@/context/AuthContext';
// import { SiSpeedtest } from 'react-icons/si';
// import Widget from './Widget';

// export default function BotTable({ bots = [], onBotsUpdate, loading = false }) {
//   const [selectedBot, setSelectedBot] = useState(null);
//   const [editOpen, setEditOpen] = useState(false);
//   const [chatOpen, setChatOpen] = useState(false);
//   const [processingId, setProcessingId] = useState(null);
//   const { user } = useAuth();

//   const handleEditClick = (bot) => {
//     setSelectedBot(bot);
//     setEditOpen(true);
//   };

//   const handleUpdate = async (botId, data) => {
//     setProcessingId(botId);
//     try {
//       const token = localStorage.getItem('idToken');
//       if (!token) {
//         toast.error('Session expired. Please login again.');
//         return;
//       }

//       const updatedBot = await updateBot(botId, data, token);
//       console.log('Updated bot from API:', updatedBot); // Debug log
//       const botToUpdate = {
//         id: botId,
//         name: updatedBot.name || data.name,
//         description: updatedBot.description || data.description,
//         status: updatedBot.status || data.status,
//         updatedAt: new Date().toISOString(),
//         createdAt: bots.find((b) => b.id === botId)?.createdAt, // Preserve createdAt
//       };
//       onBotsUpdate(botToUpdate);
//       setEditOpen(false);
//       toast.success('Bot updated successfully');
//     } catch (error) {
//       console.error('Error updating bot:', error);
//       toast.error(error.message || 'Failed to update bot');
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   const toggleChat = (bot) => {
//     setSelectedBot(bot);
//     setChatOpen((prev) => !prev);
//   };

//   const SkeletonCard = () => (
//     <div className="bg-white p-5 shadow-lg rounded-xl border border-gray-100 animate-pulse">
//       <div className="flex items-center gap-4">
//         <div className="rounded-full w-14 h-14 bg-gray-200"></div>
//         <div className="flex-1 min-w-0 space-y-2">
//           <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//           <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//         </div>
//         <div className="h-6 w-16 bg-gray-200 rounded-md"></div>
//       </div>
//       <div className="mt-4 space-y-2">
//         <div className="h-3 bg-gray-200 rounded"></div>
//         <div className="h-3 bg-gray-200 rounded w-5/6"></div>
//       </div>
//       <div className="flex items-center justify-start gap-6 mt-4">
//         <div className="h-5 w-12 bg-gray-200 rounded"></div>
//         <div className="h-5 w-14 bg-gray-200 rounded"></div>
//         <div className="h-5 w-12 bg-gray-200 rounded"></div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {[...Array(3)].map((_, index) => (
//           <SkeletonCard key={`skeleton-${index}`} />
//         ))}
//       </div>
//     );
//   }

//   if (!bots || bots.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center py-12">
//         <div className="text-center max-w-md">
//           <div className="mx-auto h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">
//             <FaRobot className="text-gray-700 h-10 w-10" />
//           </div>
//           <h3 className="mt-2 text-lg font-medium text-gray-900">No bots created</h3>
//           <p className="mt-1 text-sm text-gray-500">Get started by creating your first bot.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {bots.map((bot) => {
//           const isProcessing = processingId === bot.id;

//           return (
//             <div
//               key={bot.id}
//               className="bg-white p-5 shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow"
//             >
//               <div className="flex items-center gap-4">
//                 <div
//                   className={`rounded-full w-14 h-14 flex justify-center items-center ${bot.status === 'ACTIVE' ? 'bg-blue-200/50 text-blue-500' : 'bg-red-200/50 text-red-500'
//                     }`}
//                 >
//                   <FaRobot className="w-8 h-8" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h2 className="font-bold text-sm md:text-base text-slate-900 truncate">{bot.name}</h2>
//                   <p className="text-slate-400 text-xs md:text-sm">
//                     {new Date(bot.updatedAt).toLocaleDateString('en-US', {
//                       year: 'numeric',
//                       month: 'long',
//                       day: 'numeric',
//                     })}
//                   </p>
//                 </div>
//                 <span
//                   className={`px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap ${bot.status === 'ACTIVE'
//                       ? 'bg-green-100 text-green-700'
//                       : bot.status === 'DRAFT'
//                         ? 'bg-yellow-100 text-yellow-700'
//                         : 'bg-red-100 text-red-700'
//                     }`}
//                 >
//                   {bot.status}
//                 </span>
//               </div>
//               <div className="mt-4">
//                 <p className="text-sm font-medium text-slate-700 line-clamp-2">{bot.description}</p>
//                 <div className="flex items-center justify-start gap-6 mt-4">
//                   <button
//                     onClick={() => handleEditClick(bot)}
//                     disabled={isProcessing}
//                     className={`text-blue-600 font-medium flex cursor-pointer items-center gap-1 hover:underline focus:outline-none ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''
//                       }`}
//                   >
//                     {isProcessing ? (
//                       <span className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></span>
//                     ) : (
//                       <Edit size={14} />
//                     )}
//                     Edit
//                   </button>
//                   <Link href={`/clients/${user.clientId}/bots/${bot.id}`} passHref>
//                     <span className="text-slate-600 font-medium flex items-center gap-1 hover:underline focus:outline-none">
//                       <FaEye size={14} />
//                       View
//                     </span>
//                   </Link>

//                     <button
//                       onClick={() => toggleChat(bot)}
//                       className={`text-green-600 font-medium flex items-center gap-1 hover:underline focus:outline-none ${chatOpen && selectedBot?.id === bot.id ? 'text-green-800 font-bold' : ''
//                         }`}
//                     >
//                       <SiSpeedtest size={14} />
//                       {chatOpen && selectedBot?.id === bot.id ? 'Close Chat' : 'Test Bot'}
//                     </button>

//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {selectedBot && chatOpen && (
//         <Widget
//           onClose={() => setChatOpen(false)}
//           botId={selectedBot.id}
//           botName={selectedBot.name}
//           clientId={user.clientId}
//         />
//       )}

//       {selectedBot && editOpen && (
//         <EditBotDialog
//           bot={selectedBot}
//           open={editOpen}
//           onOpenChange={setEditOpen}
//           onUpdate={handleUpdate}
//         />
//       )}
//     </>
//   );
// }


'use client';

import { useState } from 'react';
import { FaRobot, FaEye } from 'react-icons/fa';
import { Edit } from 'lucide-react';
import EditBotDialog from './EditBotDialog';
import TestBotDialog from './TestBotDialog'; // Import the new dialog
import Link from 'next/link';
import { toast } from 'sonner';
import { updateBot } from '@/lib/api/bots';
import { useAuth } from '@/context/AuthContext';
import { SiSpeedtest } from 'react-icons/si';
import Widget from './Widget';

export default function BotTable({ bots = [], onBotsUpdate, loading = false }) {
  const [selectedBot, setSelectedBot] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [testDialogOpen, setTestDialogOpen] = useState(false); // State for TestBotDialog
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

      const updatedBot = await updateBot(botId, data, token);
      console.log('Updated bot from API:', updatedBot);
      const botToUpdate = {
        id: botId,
        name: updatedBot.name || data.name,
        description: updatedBot.description || data.description,
        status: updatedBot.status || data.status,
        updatedAt: new Date().toISOString(),
        createdAt: bots.find((b) => b.id === botId)?.createdAt,
      };
      onBotsUpdate(botToUpdate);
      setEditOpen(false);
      toast.success('Bot updated successfully');
    } catch (error) {
      console.error('Error updating bot:', error);
      toast.error(error.message || 'Failed to update bot');
    } finally {
      setProcessingId(null);
    }
  };

  const handleTestClick = (bot) => {
    setSelectedBot(bot);
    setTestDialogOpen(true); // Open the TestBotDialog
  };

  const handleCopyScript = () => {
    setTestDialogOpen(false); // Close the dialog
    setChatOpen(true); // Open the Widget
  };

  const toggleChat = (bot) => {
    setSelectedBot(bot);
    setChatOpen((prev) => !prev);
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
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first bot.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bots.map((bot) => {
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
                    className={`text-blue-600 font-medium flex items-center gap-1 hover:underline focus:outline-none ${
                      isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isProcessing ? (
                      <span className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></span>
                    ) : (
                      <Edit size={14} />
                    )}
                    Edit
                  </button>
                  <Link href={`/clients/${user.clientId}/bots/${bot.id}`} passHref>
                    <span className="text-slate-600 font-medium flex items-center gap-1 hover:underline focus:outline-none">
                      <FaEye size={14} />
                      View
                    </span>
                  </Link>
                  <button
                    onClick={() => handleTestClick(bot)} // Updated to open TestBotDialog
                    className={`text-green-600 font-medium flex items-center gap-1 hover:underline focus:outline-none ${
                      testDialogOpen && selectedBot?.id === bot.id ? 'text-green-800 font-bold' : ''
                    }`}
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

      {selectedBot && testDialogOpen && (
        <TestBotDialog
          open={testDialogOpen}
          onOpenChange={setTestDialogOpen}
          botId={selectedBot.id}
          botName={selectedBot.name}
          onCopy={handleCopyScript} // Trigger Widget opening after copy
        />
      )}

      {selectedBot && chatOpen && (
        <Widget
          onClose={() => setChatOpen(false)}
          botId={selectedBot.id}
          botName={selectedBot.name}
          clientId={user.clientId}
        />
      )}

      {selectedBot && editOpen && (
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


// 'use client';

// import { useState } from 'react';
// import { FaRobot, FaEye } from 'react-icons/fa';
// import { Edit, Copy } from 'lucide-react';
// import EditBotDialog from './EditBotDialog';
// import Link from 'next/link';
// import { toast } from 'sonner';
// import { updateBot } from '@/lib/api/bots';
// import { useAuth } from '@/context/AuthContext';
// import { SiSpeedtest } from 'react-icons/si';
// import Widget from './Widget';
// import { useRouter } from 'next/navigation';

// export default function BotTable({ bots = [], onBotsUpdate, loading = false }) {
//   const [selectedBot, setSelectedBot] = useState(null);
//   const [editOpen, setEditOpen] = useState(false);
//   const [chatOpen, setChatOpen] = useState(false);
//   const [scriptPopupOpen, setScriptPopupOpen] = useState(false);
//   const [processingId, setProcessingId] = useState(null);
//   const { user } = useAuth();
//   const router = useRouter()
  
//   const toggleChat = (bot) => {
//     setSelectedBot(bot);
//     setScriptPopupOpen(true); // Show modal with script tag
//   };

//   const copyScriptTag = () => {
//     const scriptTag = `<script src="http://localhost:3000/inject.js" data-project-id="${selectedBot.id}"></script>`;
//     navigator.clipboard.writeText(scriptTag).then(() => {
//       alert('✅ Script copied!');
//     }).catch((err) => {
//       console.error('Failed to copy:', err);
//       alert('❌ Failed to copy.');
//     });
//   };


//   const handleUpdate = async (botId, data) => {
//     setProcessingId(botId);
//     try {
//       const token = localStorage.getItem('idToken');
//       if (!token) {
//         toast.error('Session expired. Please login again.');
//         return;
//       }

//       const updatedBot = await updateBot(botId, data, token);
//       console.log('Updated bot from API:', updatedBot);
//       const botToUpdate = {
//         id: botId,
//         name: updatedBot.name || data.name,
//         description: updatedBot.description || data.description,
//         status: updatedBot.status || data.status,
//         updatedAt: new Date().toISOString(),
//         createdAt: bots.find((b) => b.id === botId)?.createdAt,
//       };
//       onBotsUpdate(botToUpdate);
//       setEditOpen(false);
//       toast.success('Bot updated successfully');
//     } catch (error) {
//       console.error('Error updating bot:', error);
//       toast.error(error.message || 'Failed to update bot');
//     } finally {
//       setProcessingId(null);
//     }
//   };



//   const SkeletonCard = () => (
//     <div className="bg-white p-5 shadow-lg rounded-xl border border-gray-100 animate-pulse">
//       <div className="flex items-center gap-4">
//         <div className="rounded-full w-14 h-14 bg-gray-200"></div>
//         <div className="flex-1 min-w-0 space-y-2">
//           <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//           <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//         </div>
//         <div className="h-6 w-16 bg-gray-200 rounded-md"></div>
//       </div>
//       <div className="mt-4 space-y-2">
//         <div className="h-3 bg-gray-200 rounded"></div>
//         <div className="h-3 bg-gray-200 rounded w-5/6"></div>
//       </div>
//       <div className="flex items-center justify-start gap-6 mt-4">
//         <div className="h-5 w-12 bg-gray-200 rounded"></div>
//         <div className="h-5 w-14 bg-gray-200 rounded"></div>
//         <div className="h-5 w-12 bg-gray-200 rounded"></div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {[...Array(3)].map((_, index) => (
//           <SkeletonCard key={`skeleton-${index}`} />
//         ))}
//       </div>
//     );
//   }

//   if (!bots || bots.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center py-12">
//         <div className="text-center max-w-md">
//           <div className="mx-auto h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">
//             <FaRobot className="text-gray-700 h-10 w-10" />
//           </div>
//           <h3 className="mt-2 text-lg font-medium text-gray-900">No bots created</h3>
//           <p className="mt-1 text-sm text-gray-500">Get started by creating your first bot.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {bots.map((bot) => {
//           const isProcessing = processingId === bot.id;

//           return (
//             <div
//               key={bot.id}
//               className="bg-white p-5 shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow"
//             >
//               <div className="flex items-center gap-4">
//                 <div
//                   className={`rounded-full w-14 h-14 flex justify-center items-center ${bot.status === 'ACTIVE' ? 'bg-blue-200/50 text-blue-500' : 'bg-red-200/50 text-red-500'
//                     }`}
//                 >
//                   <FaRobot className="w-8 h-8" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h2 className="font-bold text-sm md:text-base text-slate-900 truncate">{bot.name}</h2>
//                   <p className="text-slate-400 text-xs md:text-sm">
//                     {new Date(bot.updatedAt).toLocaleDateString('en-US', {
//                       year: 'numeric',
//                       month: 'long',
//                       day: 'numeric',
//                     })}
//                   </p>
//                 </div>
//                 <span
//                   className={`px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap ${bot.status === 'ACTIVE'
//                     ? 'bg-green-100 text-green-700'
//                     : bot.status === 'DRAFT'
//                       ? 'bg-yellow-100 text-yellow-700'
//                       : 'bg-red-100 text-red-700'
//                     }`}
//                 >
//                   {bot.status}
//                 </span>
//               </div>
//               <div className="mt-4">
//                 <p className="text-sm font-medium text-slate-700 line-clamp-2">{bot.description}</p>
//                 <div className="flex items-center justify-start gap-6 mt-4">
//                   <button
//                     onClick={() => handleEditClick(bot)}
//                     disabled={isProcessing}
//                     className={`text-blue-600 font-medium flex cursor-pointer items-center gap-1 hover:underline focus:outline-none ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''
//                       }`}
//                   >
//                     {isProcessing ? (
//                       <span className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></span>
//                     ) : (
//                       <Edit size={14} />
//                     )}
//                     Edit
//                   </button>
//                   <Link href={`/clients/${user.clientId}/bots/${bot.id}`} passHref>
//                     <span className="text-slate-600 font-medium flex items-center gap-1 hover:underline focus:outline-none">
//                       <FaEye size={14} />
//                       View
//                     </span>
//                   </Link>
//                   <button
//                     onClick={() => router.push(`/bubble?botId=${bot.id}&botName=${bot.name}&clientId=${user.clientId}`)}
//                     className={`text-green-600 font-medium flex items-center gap-1 hover:underline focus:outline-none ${chatOpen && selectedBot?.id === bot.id ? 'text-green-800 font-bold' : ''
//                       }`}
//                   >
//                     <SiSpeedtest size={14} />
//                     {chatOpen && selectedBot?.id === bot.id ? 'Close Chat' : 'Test Bot'}
//                   </button>
//                   <button onClick={() => toggleChat(bot)}>Get Bot</button>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {selectedBot && chatOpen && (
//           <Widget
//             onClose={() => setChatOpen(false)}
//             botId={selectedBot.id}
//             botName={selectedBot.name}
//             clientId={user.clientId}
//           />

//       )}

//       {selectedBot && editOpen && (
//         <EditBotDialog
//           bot={selectedBot}
//           open={editOpen}
//           onOpenChange={setEditOpen}
//           onUpdate={handleUpdate}
//         />
//       )}
//       {selectedBot && scriptPopupOpen && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//     <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
//       <h3 className="text-lg font-semibold mb-2">Embed Chat Widget</h3>
//       <p className="text-sm text-gray-600 mb-4">Paste this script into your website:</p>
      
//       <div className="bg-gray-100 p-3 rounded mb-4">
//         <code className="text-sm break-all">
//         &lt;script src="http://dev.sonicpad.ai/inject.js" data-project-id="{selectedBot.id}"&gt;&lt;/script&gt;
//         </code>
//       </div>

//       <button
//         onClick={copyScriptTag}
//         className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//       >
//         Copy Script
//       </button>

//       <button
//         onClick={() => setScriptPopupOpen(false)}
//         className="ml-2 text-gray-500"
//       >
//         Close
//       </button>
//     </div>
//   </div>
// )}
//     </>
//   );
// }


  // const handleTestBot = (bot) => {
  //   setSelectedBot(bot);
  //   setWidgetOpen(true);

  //   // Load the inject.js script dynamically
  //   const script = document.createElement('script');
  //   script.src = 'http://dev.sonicpad.ai/inject.js';
  //   script.setAttribute('data-project-id', bot.id);
  //   script.async = true;
  //   document.body.appendChild(script);

  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // };
  // const toggleChat = (bot) => {
  //   setSelectedBot(bot);
  //   setChatOpen((prev) => !prev);
  //   setScriptPopupOpen(true); // Show script tag popup when Test Bot is clicked
  // };

  // const copyScriptTag = () => {
  //   if (!selectedBot) return;
  //   const scriptTag = `<script src="http://dev.sonicpad.ai/inject.js" data-project-id="${selectedBot.id}"></script>`;
  //   navigator.clipboard.writeText(scriptTag).then(() => {
  //     toast.success('Script tag copied to clipboard!');
  //   }).catch(() => {
  //     toast.error('Failed to copy script tag.');
  //   });
  // };

// {selectedBot && scriptPopupOpen && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//     <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-semibold text-gray-900">Embed Chat Widget</h3>
//         <button
//           onClick={() => setScriptPopupOpen(false)}
//           className="text-gray-500 hover:text-gray-700"
//           aria-label="Close popup"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//         </button>
//       </div>
//       <p className="text-sm text-gray-600 mb-4">
//         Copy the script tag below and paste it into your website's HTML to embed the chat widget.
//       </p>
//       <div className="bg-gray-100 p-3 rounded-md">
//         <code className="text-sm text-gray-800 break-all">
//           &lt;script src="http://dev.sonicpad.ai/inject.js" data-project-id="{selectedBot.id}"&gt;&lt;/script&gt;
//         </code>
//       </div>
//       <button
//         onClick={copyScriptTag}
//         className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
//       >
//         <Copy size={16} />
//         Copy Script
//       </button>
//     </div>
//   </div>
// )}