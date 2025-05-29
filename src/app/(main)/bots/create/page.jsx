// app/bots/new/page.jsx
'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import BotDialog from '@/app/_components/BotComponents/BotDialog';
import { createBot } from '@/lib/api/bots';

export default function CreateBotPage() {
  const router = useRouter();

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('idToken');
      if (!token) {
        toast.error('Authentication required. Please login again.');
        router.push('/auth/login');
        return;
      }

      const botPayload = {
        clientId: formData.clientId,
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
      };

      const response = await createBot(botPayload, token);
      console.log("Sending payload:", botPayload);
      toast.success('Bot created successfully!');
      router.push('/bots');

      return response;
    } catch (error) {
      console.error('Error creating bot:', error);
      toast.error(error.message || 'Failed to create bot');
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
            <BotDialog onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}