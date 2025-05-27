'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { authServices } from '@/lib/services/auth';
import { Amplify } from 'aws-amplify';
import amplifyConfig from '@/lib/config/amplify';


export default function Logout() {
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoader(true);
    console.log('Amplify config on mount:', Amplify.configure(amplifyConfig));
    try {
        // console.log('Amplify config on mount:', Amplify.configure(amplifyConfig, { ssr: false }));
      await authServices.logout();
      localStorage.removeItem('idToken'); // Clear stored token
      toast.success('You have been logged out successfully');
      router.push('/auth/pages/login');
    } catch (error) {
      toast.error('Unable to logout. Please try again later.');
      console.error('Logout error:', error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="bg-[#f5f2f2] flex justify-center pt-14 h-screen text-[#1b0b3b] bg-bottom bg-no-repeat bg-[length:100%_300px]">
      <div className="w-full md:w-2/5 px-4 md:px-20">
        <div className="flex flex-col justify-center items-center gap-3">
          <h2 className="font-bold text-2xl mb-4">Log out of your account</h2>
        </div>
        <div className="flex flex-col gap-4 max-w-[413px] mx-auto">
          <p className="text-center text-sm">
            Are you sure you want to log out?
          </p>
          <button
            onClick={handleLogout}
            disabled={loader}
            className={`text-white mt-2 text-lg bg-[#7856ff] bg-gradient-to-t from-[#7856ff] to-[#9075ff] shadow-[inset_0_-1px_0_#5028c0,inset_0_1px_0_rgba(255,255,255,0.2)] font-medium h-[43px] rounded-[96px] transition-all duration-300 hover:rounded-md border-none outline-none ${
              loader ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loader ? 'Logging out...' : 'Log Out'}
          </button>
          <p className="text-sm font-normal leading-relaxed text-[#1b0b3b] text-center mt-2">
            Changed your mind?{' '}
            <Link
              href="/"
              className="text-[#5028c0] no-underline hover:underline transition-all duration-300"
            >
              Go back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}