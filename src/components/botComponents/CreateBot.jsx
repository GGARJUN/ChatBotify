// "use client"

// import { useAuth } from '@/context/AuthContext';
// import React, { useState } from 'react'
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import BotForm from './BotFom';
// import { FaPlus } from 'react-icons/fa6';
// import { createBot } from '@/lib/api/bots';
// import { useRouter } from 'next/navigation';

// function CreateBot() {
//   const router = useRouter();
//   const [bots, setBots] = useState([]);
//   const [pageLoading, setPageLoading] = useState(true);



//   const handleSubmit = async (formData) => {
//     setPageLoading(true);
//     try {
//       const token = localStorage.getItem('idToken');
//       if (!token) {
//         toast.error('Authentication required. Please login again.');
//         router.push('/auth/login');
//         return;
//       }

//       const botData = {
//         clientId: formData.clientId,
//         name: formData.name.trim(),
//         description: formData.description.trim(),
//         status: formData.status,
//       };

//       const response = await createBot(botData, token);

//       // Add newly created bot to list
//       setBots((prev) => [...prev, response]);
//       toast.success('Bot created successfully!');
//     } catch (error) {
//       console.error('Error creating bot:', error);
//       let errorMessage = 'Failed to create bot. Please try again.';
//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
//       toast.error(errorMessage);
//     } finally {
//       setPageLoading(false);
//     }
//   };
//   return (
//     <div>
//       {/* <BotDialog onSubmit={handleSubmit} loading={pageLoading} /> */}
//       <Dialog>
//         <DialogTrigger asChild>
//           <Button >
//             <FaPlus />
//             Create New Bot
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-[625px] bg-white rounded-2xl shadow-2xl">
//           <DialogHeader>
//             <DialogTitle className="text-2xl font-bold text-[#1b0b3b]">Create New Bot</DialogTitle>
//           </DialogHeader>
//           <BotForm onSubmit={handleSubmit} loading={pageLoading} />
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }

// export default CreateBot



"use client";

import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { FaPlus } from 'react-icons/fa6';
import { createBot } from '@/lib/api/bots';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import BotForm from './BotFom';

function CreateBot() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      if (!user) {
        toast.error('Authentication required. Please login again.');
        router.push('/auth/login');
        return;
      }

      const botData = {
        clientId: user.clientId || formData.clientId,
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
      };
      const token = localStorage.getItem('idToken');
      const response = await createBot(botData, token);
      console.log("create Bot Response", response);
      
      toast.success('Bot created successfully!');
      router.refresh(); // Refresh to show new bot in list
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
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2 ">
          <FaPlus />
          Create New Bot
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] bg-white rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#1b0b3b]">
            Create New Bot
          </DialogTitle>
        </DialogHeader>
        <BotForm 
          onSubmit={handleSubmit} 
          loading={isLoading} 
          defaultClientId={user?.clientId}
        />
      </DialogContent>
    </Dialog>
  );
}

export default CreateBot;