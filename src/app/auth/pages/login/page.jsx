'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { authServices } from '@/lib/services/auth';
import { Amplify } from 'aws-amplify';
import Header from '@/app/_components/Header';
import amplifyConfig from '@/lib/config/amplify';

export default function Login() {
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  });
  const [errFields, setErrFields] = useState({});
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log('Amplify config on mount:', Amplify.configure(amplifyConfig));
    authServices
      .getAuthenticatUser()
      .then((session) => {
        if (session.tokens) {
          router.push('/dashboard');
        }
      })
      .catch((error) => {
        console.log('No authenticated user:', error.message);
      });
  }, [router]);

  const validateForm = (form) => {
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordReg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/;

    const errors = {};

    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailReg.test(form.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!form.password.trim()) {
      errors.password = 'Password is required';
    } else if (!passwordReg.test(form.password)) {
      errors.password =
        'Password must be at least 8 characters long, including one uppercase letter, one lowercase letter, one number, and one special character';
    }

    setErrFields(errors);
    return Object.keys(errors).length;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    validateForm({ ...formValues, [name]: value });
  };

  const handleLogin = async () => {
    if (validateForm(formValues) > 0) {
      toast.error('Please fix the form errors');
      return;
    }

    setLoader(true);
    try {
      const res = await authServices.login(formValues);
      if (res.isSignedIn) {
        const session = await authServices.getAuthenticatUser();
        const idToken = session.tokens?.idToken?.toString();

        if (idToken) {
          localStorage.setItem('idToken', idToken);
        } else {
          console.warn('ID Token is undefined');
        }

        toast.success('You have been logged in successfully');
        router.push('/dashboard');
      } else {
        toast.error('Please activate your account to login');
      }
    } catch (error) {
      let title = 'Unable to login. Please try again later.';
      if (error.name === 'InvalidParameterException') {
        title = 'Authentication flow not enabled. Please contact support.';
      } else if (error.name === 'AuthUserPoolException') {
        title = 'Authentication configuration error. Please contact support.';
      } else if (error.name === 'UserAlreadyAuthenticatedException') {
        router.push('/dashboard');
        return;
      } else if (error.name === 'NotAuthorizedException') {
        title = 'Incorrect email or password';
      } else if (error.name === 'UserNotFoundException') {
        title = 'User does not exist';
      } else if (error.name === 'UserNotConfirmedException') {
        title = 'Please confirm your account before logging in';
      }

      toast.error(title);
      console.error('Login error:', error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className='h-screen bg-gradient-to-b to-[#b3bfe9]'>
      <Header />
      <div className=" flex justify-center pt-10  text-[#1b0b3b] ">
        <div className="bg-white  px-20 py-10 rounded-2xl shadow-2xl">
          <div className="flex flex-col justify-center items-center gap-3 w-96">
            <img src="https://cdn-icons-png.freepik.com/256/12219/12219540.png?uid=R110556143&ga=GA1.1.1704431159.1736575258&semt=ais_hybrid" alt="" className='w-10 h-10' />
            <h2 className="font-bold text-2xl mb-4">Log in to Chatbotify</h2>
          </div>
          <div className="flex flex-col gap-4 max-w-[413px] mx-auto">
            <div className="relative">
              <p className="relative bg-white w-fit mx-auto px-2 text-gray-600 text-xs">or</p>
              <span className="absolute left-0 top-[70%] w-full h-[1px] bg-[#eae6e7]"></span>
            </div>
            <div className="text-left">
              <label htmlFor="email" className="text-sm font-medium mb-1 block">
                Email
              </label>
              <input
                id="email"
                style={{ padding: '10px', width: '100%', borderRadius: '10px' }}
                placeholder="e.g. eleanor@mixpixel.com"
                value={formValues.email}
                name="email"
                onChange={handleChange}
                className={`w-full border border-[#eae6e7] rounded-[10px] min-h-[52px] px-6 py-3.5 text-base outline-none transition-all duration-300 hover:border-[#7856ff] ${errFields.email ? 'border-red-500 border-2' : ''
                  }`}
              />
              {errFields.email && <small className="text-red-600 font-bold text-sm">{errFields.email}</small>}
            </div>
            <div className="text-left">
              <label htmlFor="password" className="text-sm font-medium mb-1 block">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formValues.password}
                name="password"
                onChange={handleChange}
                placeholder="Example@123"
                className={`w-full border border-[#eae6e7] rounded-lg min-h-[52px] px-6 py-3.5 text-base outline-none transition-all duration-300 hover:border-[#7856ff] ${errFields.password ? 'border-red-500 border-2' : ''
                  }`}
              />
              {errFields.password && <small className="text-red-600 font-bold text-sm">{errFields.password}</small>}
            </div>
            <button
              onClick={handleLogin}
              disabled={loader}
              className={`text-white mt-2 text-lg bg-[#7856ff] bg-gradient-to-t from-[#7856ff] to-[#9075ff] shadow-[inset_0_-1px_0_#5028c0,inset_0_1px_0_rgba(255,255,255,0.2)] font-medium h-[43px] rounded-[96px] transition-all duration-300 hover:rounded-md border-none outline-none ${loader ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {loader ? 'Logging in...' : 'Login'}
            </button>
            <p className="text-sm font-normal leading-relaxed text-[#1b0b3b] text-center mt-2">
              Don't have an account?{' '}
              <Link href="/auth/pages/register" className="text-[#5028c0] no-underline hover:underline transition-all duration-300">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}