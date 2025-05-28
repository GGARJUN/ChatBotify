"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { signUp } from '@/lib/api/auth';
import Header from '@/app/_components/Header';
import { AuthForm } from '@/app/_components/auth/AuthForm';

export default function RegisterPage() {
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  

  const handleRegister = async (userData) => {
    setLoader(true);
    try {
      await signUp(userData);
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      // Handle error (show toast or error message)
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className=" bg-gradient-to-b to-[#b3bfe9]">
      <Header />
      <div className="flex justify-center pt-10 text-[#1b0b3b]">
        <div className="bg-white px-20 py-10 rounded-2xl shadow-2xl">
          <div className="flex flex-col justify-center items-center gap-3 w-96">
            <img
              src="https://cdn-icons-png.freepik.com/256/12219/12219540.png?uid=R110556143&ga=GA1.1.1704431159.1736575258&semt=ais_hybrid"
              alt=""
              className="w-10 h-10"
            />
            <h2 className="font-bold text-2xl mb-4">Create your account</h2>
          </div>
          <AuthForm type="register" onSubmit={handleRegister} loading={loader} />
        </div>
      </div>
    </div>
  );
}