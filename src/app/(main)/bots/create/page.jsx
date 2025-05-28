'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createBot } from '@/lib/api/bots';
import BotDialog from '@/app/_components/BotComponents/BotDialog';

export default function CreateBotPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      // Verify authentication
      let token;
      try {
        const token = localStorage.getItem('idToken');
        if (!token) {
          toast.error('Authentication required. Please login again.');
          router.push('/auth/login');
          console.log('Authentication required. Please login again.');
          
          return;
        }
      } catch (authError) {
        console.error('Authentication error:', authError);
        toast.error('Authentication required. Please login again.');
        router.push('/auth/pages/login');
        return;
      }

      const botData = {
        clientId: formData.clientId,
        name: formData.name,
        description: formData.description,
        status: formData.status,
        billing: {
          billingType: formData.billing.billingType,
          priceInCents: Number(formData.billing.priceInCents),
          billingStartDate: new Date(formData.billing.billingStartDate).toISOString(),
          billingEndDate: new Date(formData.billing.billingEndDate).toISOString(),
          isBillingActive: Boolean(formData.billing.isBillingActive),
          stripeSubscriptionId: formData.billing.stripeSubscriptionId,
        },
      };

      const response = await createBot(botData, token);
      toast.success('Bot created successfully!');
      router.push('/bots');
      return response;
    } catch (error) {
      console.error('Error creating bot:', error);
      let errorMessage = 'Failed to create bot';
      if (error.response?.status === 401) {
        errorMessage = 'Unauthorized: Invalid or expired token. Please login again.';
        router.push('/auth/pages/login');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b to-[#b3bfe9]">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-2xl p-6">
          <div className="border-b border-gray-200 pb-5">
            <h3 className="text-lg font-medium leading-6 text-[#1b0b3b]">Create New Bot</h3>
            <p className="mt-2 max-w-4xl text-sm text-gray-500">
              Configure your new AI assistant with the details below.
            </p>
          </div>
          <div className="mt-6">
            <BotDialog onSubmit={handleSubmit} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}