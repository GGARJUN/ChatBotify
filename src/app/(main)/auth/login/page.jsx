// "use client"
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { signIn } from '@/lib/api/auth';
// import Header from '@/app/_components/Header';
// import { AuthForm } from '@/app/_components/auth/AuthForm';
// import { toast } from 'sonner';
// import { useAuth } from '@/context/AuthContext';



// export default function LoginPage() {
//   const router = useRouter();
//   const [loader, setLoader] = useState(false);
//   const { setUser } = useAuth();

//   const handleLogin = async (credentials) => {
//     setLoader(true);
//     try {
//       const response = await signIn(credentials);
//       console.log("Login response:", response); // Debug log
//       // Store tokens and user data

//         localStorage.setItem('idToken', response.idToken);
//         localStorage.setItem('accessToken', response.accessToken);
//         localStorage.setItem('refreshToken', response.refreshToken);
//         console.log('Stored idToken:', localStorage.getItem('idToken'));
//       // Store user data
//       if (response) {
//         localStorage.setItem('user', response.idToken);
//         setUser(response);
//       }

//       toast.success('You have been logged in successfully');
//       console.log('Redirecting to dashboard...');
//       router.push('/dashboard');
//     } catch (error) {
//       console.error("Login error:", error); // Debug log
//       let title = 'Unable to login. Please try again later.';
//       // Handle specific error cases
//       if (error.message.includes('InvalidParameterException')) {
//         title = 'Authentication flow not enabled. Please contact support.';
//       } else if (error.message.includes('NotAuthorizedException')) {
//         title = 'Incorrect email or password';
//       } else if (error.message.includes('UserNotFoundException')) {
//         title = 'User does not exist';
//       } else if (error.message.includes('UserNotConfirmedException')) {
//         title = 'Please confirm your account before logging in';
//       }
//       toast.error(title);
//     } finally {
//       setLoader(false);
//     }
//   };

//   return (
//     <div className="h-screen bg-gradient-to-b to-[#b3bfe9]">
//       <Header />
//       <div className="flex justify-center pt-10 text-[#1b0b3b]">
//         <div className="bg-white px-20 py-10 rounded-2xl shadow-2xl">
//           <div className="flex flex-col justify-center items-center gap-3 w-96">
//             <img
//               src="https://cdn-icons-png.freepik.com/256/12219/12219540.png?uid=R110556143&ga=GA1.1.1704431159.1736575258&semt=ais_hybrid"
//               alt=""
//               className="w-10 h-10"
//             />
//             <h2 className="font-bold text-2xl mb-4">Log in to Chatbotify</h2>
//           </div>
//           <AuthForm type="login" onSubmit={handleLogin} loading={loader} />
//         </div>
//       </div>
//     </div>
//   );
// }




'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/app/_components/Header';
import { AuthForm } from '@/app/_components/auth/AuthForm';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (credentials) => {
    setLoader(true);
    try {
      await login(credentials);
      toast.success('You have been logged in successfully');
    } catch (error) {
      console.error("Login error:", error);
      let title = 'Unable to login. Please try again later.';
      
      if (error.message.includes('InvalidParameterException')) {
        title = 'Authentication flow not enabled. Please contact support.';
      } else if (error.message.includes('NotAuthorizedException')) {
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