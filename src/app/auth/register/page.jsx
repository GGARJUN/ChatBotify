


"use client";

import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

import Header from '@/components/homeComponents/Header';
import { AuthForm } from '@/components/authComponents/AuthForm';

export default function RegisterPage() {
  const { register, loading, authError } = useAuth();
  const [formError, setFormError] = useState(null);

  const handleRegister = async (formData) => {
    try {
      setFormError(null);
      await register(formData);
    } catch (error) {
      toast.error(errorMessage);
      console.error('Registration error:', error);
      setFormError(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b to-[#b3bfe9]">
      <Header />

      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">


        <div className="bg-white px-10 py-10 rounded-2xl shadow-2xl ">
          <div className="flex flex-col justify-center items-center gap-3 mb-5">
            <img
              src="https://cdn-icons-png.freepik.com/256/12219/12219540.png?uid=R110556143&ga=GA1.1.1704431159.1736575258&semt=ais_hybrid"
              alt="Chatbotify logo"
              className="w-10 h-10"
            />
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Create your account</h2>
          </div>
          {formError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {formError}
            </div>
          )}

          <AuthForm
            type="register"
            onSubmit={handleRegister}
            loading={loading}
          />

          <div className="mt-6 text-center text-sm text-gray-500">
            By registering, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>.
          </div>
        </div>
      </div>
    </div>
  );
}