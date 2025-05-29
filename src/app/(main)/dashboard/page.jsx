// 'use client';

// import BotTable from '@/app/_components/BotComponents/BotTable';
// import { useAuth } from '@/context/AuthContext';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { getBots, createBot } from '@/lib/api/bots';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { Plus } from 'lucide-react';
// import { FaRobot } from "react-icons/fa";

// export default function DashBoard() {
//   const { user, loading } = useAuth();
//   const router = useRouter();
//   const [bots, setBots] = useState([]);


//   useEffect(() => {
//     const fetchBots = async () => {
//       try {
//         const token = localStorage.getItem('user');
//         if (!token) {
//           // toast.error('Authentication required. Please login again.');
//           router.push('/auth/login');
//           console.log('Authentication required. Please login again.');

//           return;
//         }
//         const response = await getBots(token);
//         setBots(response);
//       } catch (error) {
//         console.error('Error fetching bots:', error);
//         toast.error('Failed to fetch bots');
//       }
//     };
//     fetchBots();
//   }, [router]);

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push('/auth/login');
//     }
//   }, [user, loading, router]);

//   if (loading || !user) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className=' '>
//       <div className='flex justify-between items-center'>
//         <div>
//           <h2 className='text-slate-900 text-2xl font-bold '>Welcome back, Alex!</h2>
//           <p className='tet-sm text-slate-500  font-medium'>Your chatbot automation at a glance</p>
//         </div>
//         <Button><Plus /> Create New Bot</Button>
//       </div>
//       <div className='grid grid-cols-3 gap-5 items-center my-10'>
//         <div className=" bg-white rounded-xl p-3  shadow-xl">
//           <div
//             className="bg-blue-200/50 rounded-full w-14 h-14 flex justify-center items-center"
//           >
//             <FaRobot  className="text-blue-600 w-8 h-8" />
//           </div>
//         </div>
//       </div>
//       <div className=" bg-white rounded-xl p-3  shadow-xl">
//         <div className="flex justify-between items-center  pb-5">
//           <h3 className="text-lg font-medium leading-6 text-[#1b0b3b]">Your Bots</h3>
//           {/* <BotDialog onSubmit={handleSubmit} loading={loading} /> */}
//         </div>
//         <BotTable bots={bots} />
//       </div>
//     </div>
//   );
// }



// app/dashboard/page.jsx
"use client";

import BotTable from '@/app/_components/BotComponents/BotTable';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getBots } from '@/lib/api/bots';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { FaRobot, FaUsers } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import BotDialog from '@/app/_components/BotComponents/BotDialog';

export default function DashBoard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [bots, setBots] = useState([]);

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const token = localStorage.getItem('idToken');
        if (!token) {
          router.push('/auth/login');
          return;
        }
        const response = await getBots(token);
        setBots(response);
      } catch (error) {
        console.error('Error fetching bots:', error);
        toast.error('Failed to fetch bots');
      }
    };

    fetchBots();
  }, [router]);

  const handleBotUpdate = (updatedBot) => {
    setBots((prev) =>
      prev.map((bot) => (bot.id === updatedBot.id ? updatedBot : bot))
    );
  };

   // Handle form submission to create a new bot
    const handleSubmit = async (formData) => {
      setLoading(true);
      try {
        const token = localStorage.getItem('idToken');
        if (!token) {
          toast.error('Authentication required. Please login again.');
          router.push('/auth/login');
          return;
        }
  
        const botData = {
          clientId: formData.clientId,
          name: formData.name.trim(),
          description: formData.description.trim(),
          status: formData.status,
        };
  
        const response = await createBot(botData, token);
  
        // Add the newly created bot to the list
        setBots((prev) => [...prev, response]);
        toast.success('Bot created successfully!');
      } catch (error) {
        console.error('Error creating bot:', error);
        let errorMessage = 'Failed to create bot. Please try again.';
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
  
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className=''>Loading...</div>;
  }

  return (
    <div>
      <div className='flex justify-between items-center '>
        <div>
          <h2 className='text-slate-900 text-2xl font-bold'>Welcome back, {user.firstName}!</h2>
          <p className='text-sm text-slate-500 font-medium'>Your chatbot automation at a glance</p>
        </div>
        {/* <Button><Plus /> Create New Bot</Button> */}
        <BotDialog onSubmit={handleSubmit} loading={loading} />
      </div>

      <div className='grid grid-cols-3 gap-5 items-center my-10'>
        <div className="bg-white rounded-xl p-3 py-5 shadow-xl flex  items-center gap-5">
          <div className="bg-blue-200/50 rounded-full w-14 h-14 flex justify-center items-center">
            <FaRobot className="text-blue-600 w-8 h-8" />
          </div>
          <div>
            <h2 className="font-bold text-sm md:text-xl text-slate-900 truncate">5</h2>
            <p className="text-sm font-medium text-slate-700 line-clamp-2">Active Bots</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-3 py-5 shadow-xl flex  items-center gap-5">
          <div className="bg-green-200/50 rounded-full w-14 h-14 flex justify-center items-center">
          <AiFillMessage className="text-green-600 w-8 h-8" />
          </div>
          <div>
            <h2 className="font-bold text-sm md:text-xl text-slate-900 truncate">1,230</h2>
            <p className="text-sm font-medium text-slate-700 line-clamp-2">Chats Handled</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-3 py-5 shadow-xl flex  items-center gap-5">
          <div className="bg-yellow-200/50 rounded-full w-14 h-14 flex justify-center items-center">
            <FaUsers className="text-yellow-600 w-8 h-8" />
          </div>
          <div>
            <h2 className="font-bold text-sm md:text-xl text-slate-900 truncate">17</h2>
            <p className="text-sm font-medium text-slate-700 line-clamp-2">Team Members</p>
          </div>
        </div>
      </div>

      <div className="">
        <div className=" pb-5">
          <h3 className="text-2xl font-semibold leading-6 text-[#1b0b3b]">Your Recent Chatbots</h3>
          <p className='font-medium text-slate-400 mt-2'>Manage and crete chatbots for your customers</p>
        </div>
        <BotTable bots={bots} onBotsUpdate={handleBotUpdate} />
      </div>
    </div>
  );
}