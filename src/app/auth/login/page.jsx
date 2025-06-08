


"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

import Header from '@/components/homeComponents/Header';
import Link from 'next/link';
import { AuthForm } from '@/components/authComponents/AuthForm';

export default function LoginPage() {

  const { user, login, loading } = useAuth();
  const [formError, setFormError] = useState(null);

  // useEffect(() => {
  //   if (user) {
  //     router.push('/dashboard');
  //   }
  // }, [user, router]);

  const handleLogin = async (credentials) => {
    try {
      setFormError(null);
      await login(credentials);
      toast.success('Login successful...');
    } catch (error) {
      console.error('Login error:', error);
      setFormError(error.message || 'Login failed. Please try again.');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b to-[#b3bfe9]">
      <Header />

      <div className="max-w-xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

        <div className="bg-white px-10 py-10 rounded-2xl shadow-2xl ">
          <div className="flex flex-col justify-center items-center gap-3 ">
            <img
              src="https://cdn-icons-png.freepik.com/256/12219/12219540.png?uid=R110556143&ga=GA1.1.1704431159.1736575258&semt=ais_hybrid"
              alt="Chatbotify logo"
              className="w-10 h-10"
            />
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Log in to Chatbotify</h2>
          </div>
          {formError && (
            
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {formError}
            </div>
          )}

          <AuthForm
            type="login"
            onSubmit={handleLogin}
            loading={loading}
          />

          <div className="mt-2 text-center text-sm">
            <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}