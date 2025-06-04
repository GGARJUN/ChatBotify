
// // Fetch bots and sort by most recent
// useEffect(() => {
//   const fetchBots = async () => {
//     try {
//       const token = localStorage.getItem('idToken');
//       const storedUser = localStorage.getItem('user');
//       console.log("details", storedUser);

//       if (!token) {
//         router.push('/auth/login');
//         return;
//       }

//       const response = await getBots(token);
//       const fetchedBots = Array.isArray(response) ? response : [];

//       // Sort bots by createdAt (most recent first)
//       const sortedBots = [...fetchedBots].sort((a, b) => {
//         const dateA = new Date(a.bot?.createdAt || a.createdAt).getTime();
//         const dateB = new Date(b.bot?.createdAt || b.createdAt).getTime();
//         return dateB - dateA; // Descending order
//       });

//       console.log("bots", fetchedBots);
//       console.log("response", response);


//       setBots(sortedBots);
//     } catch (error) {
//       console.error('Error fetching bots:', error);
//       toast.error('Failed to load bots');
//     } finally {
//       setPageLoading(false);
//     }
//   };

//   const fetchBotDetails = async () => {
//     const token = localStorage.getItem('idToken');
//     const botId = bots.id;

//     try {
//       const botData = await getSingleBot(botId, token, true); // includeDocs = true
//       console.log('Fetched Bot Data:', botData);
//     } catch (error) {
//       console.error('Failed to fetch bot:', error.message);
//     }
//   };

//   fetchBots();
//   fetchBotDetails();
// }, [router]);

// Fetch all bots
// const fetchBots = async () => {
//   try {
//     const token = localStorage.getItem('idToken');
//     if (!token) {
//       router.push('/auth/login');
//       return;
//     }

//     const response = await getBots(token);
//     const fetchedBots = Array.isArray(response) ? response : [];
//     console.log("bots", fetchedBots);
//     console.log("response", response);

//     const sortedBots = [...fetchedBots].sort((a, b) => {
//       const dateA = new Date(a.bot?.createdAt || a.createdAt).getTime();
//       const dateB = new Date(b.bot?.createdAt || b.createdAt).getTime();
//       return dateB - dateA; // Descending order
//     });

//     setBots(sortedBots);
//   } catch (error) {
//     console.error('Error fetching bots:', error.message);
//     toast.error('Failed to load bots');
//   } finally {
//     setPageLoading(false);
//   }
// };

// Handle bot update in list
// const handleBotUpdate = (updatedBot) => {
//   setBots((prev) =>
//     prev.map((bot) => (bot.id === updatedBot.id ? updatedBot : bot))
//   );
// };

// Load bots on mount
// useEffect(() => {
//   fetchBots();
// }, []);

// Handle form submission to create a new bot
// const handleSubmit = async (formData) => {
//   setPageLoading(true);
//   try {
//     const token = localStorage.getItem('idToken');
//     if (!token) {
//       toast.error('Authentication required. Please login again.');
//       router.push('/auth/login');
//       return;
//     }

//     const botData = {
//       clientId: formData.clientId,
//       name: formData.name.trim(),
//       description: formData.description.trim(),
//       status: formData.status,
//     };

//     const response = await createBot(botData, token);

//     // Add newly created bot to list
//     setBots((prev) => [...prev, response]);
//     toast.success('Bot created successfully!');
//   } catch (error) {
//     console.error('Error creating bot:', error);
//     let errorMessage = 'Failed to create bot. Please try again.';
//     if (error.response?.data?.message) {
//       errorMessage = error.response.data.message;
//     } else if (error.message) {
//       errorMessage = error.message;
//     }
//     toast.error(errorMessage);
//   } finally {
//     setPageLoading(false);
//   }
// };

// Redirect if not authenticated
// useEffect(() => {
//   if (!authLoading && !user) {
//     router.push('/auth/login');
//   }
// }, [authLoading, user, router]);

// if (authLoading || pageLoading || !user) {
//   return (
//     <div className="flex justify-center items-center py-8">
//       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//     </div>
//   );
// }



"use client";

import { useAuth } from '@/context/AuthContext';
import BotList from '@/components/botComponents/BotList';
import CreateBot from '@/components/botComponents/CreateBot';

export default function DashBoard() {
  const { user } = useAuth();
  console.log(user);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome back, {user.name} !</h2>
          <p className="text-sm text-slate-500 mt-1">Your chatbot automation at a glance</p>
        </div>
        <CreateBot />
      </div>
      <BotList />
    </div>
  );
}