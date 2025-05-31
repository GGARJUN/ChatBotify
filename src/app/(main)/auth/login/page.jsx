

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/api/auth';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import Header from '@/app/_components/Header';
import { AuthForm } from '../_compoents/AuthForm';


export default function LoginPage() {
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const { setUser,user } = useAuth();

    useEffect(() => {
      if ( user) {
        router.push('/dashboard');
        console.log("user",user);
      }
    }, [ user, router]);

  const handleLogin = async (credentials) => {
    setLoader(true);
    try {
      const response = await signIn(credentials);
      const idToken = response.idToken;
      const decodedUser = jwtDecode(idToken);

      const userData = {
        userId: decodedUser["custom:userId"] || decodedUser.sub,
        email: decodedUser.email || "",
        name: decodedUser.name || "",
        clientId: decodedUser["custom:clientId"] || null,
      };

      console.log("details user",userData);
      console.log("decode details user",decodedUser);
      

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('idToken', response.idToken);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      setUser(userData);
      toast.success('You have been logged in successfully');
      router.push('/dashboard');
    } catch (error) {
      let title = 'Unable to log in. Please try again later.';
      if (error.message.includes('NotAuthorizedException')) {
        title = 'Incorrect email or password';
      } else if (error.message.includes('UserNotFoundException')) {
        title = 'User does not exist';
      } else if (error.message.includes('UserNotConfirmedException')) {
        title = 'Please confirm your account before logging in';
      }
      toast.error(title);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b to-[#b3bfe9]">
      <Header />
      <div className="flex justify-center pt-10 text-[#1b0b3b]">
        <div className="bg-white px-20 py-10 rounded-2xl shadow-2xl">
          <div className="flex flex-col justify-center items-center gap-3 w-96">
            <img
              src="https://cdn-icons-png.freepik.com/256/12219/12219540.png?uid=R110556143&ga=GA1.1.1704431159.1736575258&semt=ais_hybrid"
              alt=""
              className="w-10 h-10"
            />
            <h2 className="font-bold text-2xl mb-4">Log in to Chatbotify</h2>
          </div>
          <AuthForm type="login" onSubmit={handleLogin} loading={loader} />
        </div>
      </div>
    </div>
  );
}