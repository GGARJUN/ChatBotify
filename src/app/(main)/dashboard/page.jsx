'use client';

import BotTable from '@/app/_components/BotComponents/BotTable';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getBots, createBot } from '@/lib/api/bots';
import { toast } from 'sonner';

export default function DashBoard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [bots, setBots] = useState([]);


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

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className=' '>
      <div className=" bg-white rounded-xl p-3 my-80 shadow-xl">
        <div className="flex justify-between items-center border-b border-gray-200 pb-5">
          <h3 className="text-lg font-medium leading-6 text-[#1b0b3b]">Your Bots</h3>
          {/* <BotDialog onSubmit={handleSubmit} loading={loading} /> */}
        </div>
        <BotTable bots={bots} />
      </div>
    </div>
  );
}