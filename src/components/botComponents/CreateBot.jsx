'use client'

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FaPlus } from 'react-icons/fa6';
import { createBot, getBots } from '@/lib/api/bots';
import { checkSubscriptionStatus } from '@/lib/api/payment';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import BotForm from './BotForm';
import Link from 'next/link';

function CreateBot({ onCreate }) {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [checkingSub, setCheckingSub] = useState(true);
  const [botsCount, setBotsCount] = useState(0);
  const [showLimitDialog, setShowLimitDialog] = useState(false);

  const fetchSubscription = async () => {
    if (!user) {
      setCheckingSub(false);
      return;
    }
    try {
      const token = localStorage.getItem('idToken');
      if (!token) {
        throw new Error('No authentication token found.');
      }
      const isSubscribed = await checkSubscriptionStatus(token);
      setIsPro(isSubscribed);
      console.log('Updated isPro state:', isSubscribed);
    } catch (error) {
      console.error('Error fetching subscription status:', error.message);
      setIsPro(false);
    } finally {
      setCheckingSub(false);
    }
  };

  const fetchBotsCount = async () => {
    try {
      const token = localStorage.getItem('idToken');
      if (!token) {
        throw new Error('No authentication token found.');
      }
      const response = await getBots(token);
      const fetchedBots = Array.isArray(response) ? response : [];
      setBotsCount(fetchedBots.length);
    } catch (error) {
      console.error('Error fetching bots count:', error.message);
      toast.error('Failed to fetch bots count');
    }
  };

  // Fetch subscription and bots count on mount
  useEffect(() => {
    fetchSubscription();
    fetchBotsCount();
  }, []);

  const handleOpenCreateDialog = () => {
    // Check bot limit based on subscription
    const maxBots = isPro ? 3 : 1;
    if (botsCount >= maxBots) {
      setShowLimitDialog(true); // Show limit exceeded dialog
      setOpen(false); // Ensure Create Bot dialog doesn't open
    } else {
      setOpen(true); // Open create bot dialog
      setShowLimitDialog(false); // Ensure limit dialog is closed
    }
  };

  const handleCloseLimitDialog = () => {
    setShowLimitDialog(false);
    setOpen(false); // Close the Create Bot dialog as well
  };

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      if (!user) {
        toast.error('Authentication required. Please login again.');
        router.push('/auth/login');
        return;
      }

      const botData = {
        clientId: user.clientId,
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
      };

      const token = localStorage.getItem('idToken');
      await createBot(botData, token);

      toast.success('Bot created successfully!');
      onCreate(); // Notify parent that a bot was created
      setBotsCount(botsCount + 1); // Increment bots count
      setOpen(false); // Close the dialog
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
    <>
      {/* Create Bot Dialog Trigger */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2" onClick={handleOpenCreateDialog} disabled={checkingSub}>
            <FaPlus />
            Create New Bot
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px] bg-white rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#1b0b3b]">
              Create New Bot
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Fill in the details below to create a new bot.
            </DialogDescription>
          </DialogHeader>
          <BotForm
            onSubmit={handleSubmit}
            loading={isLoading}
            defaultClientId={user?.clientId}
          />
        </DialogContent>
      </Dialog>

      {/* Limit Exceeded Dialog */}
      <Dialog open={showLimitDialog} onOpenChange={handleCloseLimitDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#1b0b3b]">
              Bot Limit Reached
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              You have reached the maximum number of bots for your plan. Upgrade your plan to create more bots.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseLimitDialog}>
              Cancel
            </Button>
            <Link href={`/clients/${user?.clientId}/pricing`}>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Upgrade Plan
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateBot;

// "use client";

// import { useAuth } from '@/context/AuthContext';
// import { useEffect, useState } from 'react';
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { FaPlus } from 'react-icons/fa6';
// import { createBot } from '@/lib/api/bots';
// import { useRouter } from 'next/navigation';
// import { toast } from 'sonner';
// import BotForm from './BotForm';
// import { checkSubscriptionStatus } from '@/lib/api/payment';

// function CreateBot({ onCreate }) {
//   const router = useRouter();
//   const { user } = useAuth();
//   const [isLoading, setIsLoading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [isPro, setIsPro] = useState(false);
//   const [checkingSub, setCheckingSub] = useState(true);

//   const fetchSubscription = async () => {
//     if (!user) {
//       setCheckingSub(false);
//       return;
//     }
//     try {
//       const token = localStorage.getItem('idToken');
//       if (!token) {
//         throw new Error('No authentication token found.');
//       }
//       const isSubscribed = await checkSubscriptionStatus(token);
//       setIsPro(isSubscribed);
//       console.log('Updated isPro state:', isSubscribed);
//     } catch (error) {
//       console.error('Error fetching subscription status:', error.message);
//       setIsPro(false);
//     } finally {
//       setCheckingSub(false);
//     }
//   };

//   // Fetch subscription and bots on mount
//   useEffect(() => {
//     fetchSubscription();
//   }, []);

//   const handleSubmit = async (formData) => {
//     setIsLoading(true);
//     try {
//       if (!user) {
//         toast.error('Authentication required. Please login again.');
//         router.push('/auth/login');
//         return;
//       }

//       const botData = {
//         clientId: user.clientId,
//         name: formData.name.trim(),
//         description: formData.description.trim(),
//         status: formData.status,
//       };

//       const token = localStorage.getItem('idToken');
//       await createBot(botData, token);

//       toast.success('Bot created successfully!');
//       onCreate(); // Notify parent that a bot was created
//       setOpen(false); // Close the dialog
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
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button className="gap-2">
//           <FaPlus />
//           Create New Bot
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[625px] bg-white rounded-2xl shadow-2xl">
//         <DialogHeader>
//           <DialogTitle className="text-2xl font-bold text-[#1b0b3b]">
//             Create New Bot
//           </DialogTitle>
//           <DialogDescription className="text-sm text-gray-500">
//             Fill in the details below to create a new bot.
//           </DialogDescription>
//         </DialogHeader>
//         <BotForm
//           onSubmit={handleSubmit}
//           loading={isLoading}
//           defaultClientId={user?.clientId}
//         />
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default CreateBot;