'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getBots, createBot } from '@/lib/api/bots';
import Header from '@/app/_components/Header';
import BotDialog from '@/app/_components/BotComponents/BotDialog';
import BotTable from '@/app/_components/BotComponents/BotTable';


export default function BotsPage() {
  const router = useRouter();
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const token = localStorage.getItem('idToken');
        if (!token) {
          toast.error('Authentication required. Please login again.');
          router.push('/auth/login');
          console.log('Authentication required. Please login again.');
          
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

  // const handleSubmit = async (formData) => {
  //   setLoading(true);
  //   try {
  //     const token = localStorage.getItem('idToken');
  //     if (!token) {
  //       toast.error('Authentication required. Please login again.');
  //       router.push('/auth/login');
  //       return;
  //     }

  //     const botData = {
  //       clientId: formData.clientId,
  //       name: formData.name,
  //       description: formData.description,
  //       status: formData.status,
  //       billing: {
  //         billingType: formData.billing.billingType,
  //         priceInCents: Number(formData.billing.priceInCents),
  //         billingStartDate: new Date(formData.billing.billingStartDate).toISOString(),
  //         billingEndDate: new Date(formData.billing.billingEndDate).toISOString(),
  //         isBillingActive: Boolean(formData.billing.isBillingActive),
  //         stripeSubscriptionId: formData.billing.stripeSubscriptionId,
  //       },
  //     };

  //     const response = await createBot(botData, token);
  //     setBots((prev) => [...prev, response]);
  //     toast.success('Bot created successfully!');
  //   } catch (error) {
  //     console.error('Error creating bot:', error);
  //     let errorMessage = 'Failed to create bot';
  //     if (error.response?.data?.message) {
  //       errorMessage = error.response.data.message;
  //     } else if (error.message) {
  //       errorMessage = error.message;
  //     }
  //     toast.error(errorMessage);
  //     throw error;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-b to-[#b3bfe9]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-2xl p-6">
          {/* <div className="flex justify-between items-center border-b border-gray-200 pb-5">
            <h3 className="text-lg font-medium leading-6 text-[#1b0b3b]">Your Bots</h3>
            <BotDialog onSubmit={handleSubmit} loading={loading} />
          </div> */}
          <div className="mt-6">
            <BotTable bots={bots} />
          </div>
        </div>
      </div>
    </div>
  );
}