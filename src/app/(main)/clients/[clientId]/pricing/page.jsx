// File: components/PricingPage.jsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // For animations
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';
import { initPayment } from '@/lib/api/payment';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {user} =useAuth();

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('idToken');
      if (!token) {
        toast.error('Please log in to subscribe.');
        return;
      }

      const payload = {
        billingType: isYearly ? 'ANNUAL' : 'MONTHLY',
        successUrl: `${window.location.origin}/clients/${user.clientId}/success`,
        cancelUrl: `${window.location.origin}/clients/${user.clientId}/cancel`,
      };

      const { checkoutUrl } = await initPayment(payload, token);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to initiate subscription.');
    } finally {
      setIsLoading(false);
    }
  };

  // Custom toggle switch component
  const CustomSwitch = ({ checked, onChange }) => {
    return (
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${checked ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gray-300'
          }`}
      >
        <span
          className={`absolute left-1 h-6 w-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-8' : 'translate-x-0'
            }`}
        />
        <span className="sr-only">{checked ? 'Yearly' : 'Monthly'}</span>
      </button>
    );
  };

  return (
    <div className="  py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock the full potential of your bots with our flexible plans. No hidden fees, cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <span
              className={`text-base md:text-lg font-medium transition-colors duration-300 ${!isYearly ? 'text-gray-900' : 'text-gray-500'
                }`}
            >
              Monthly
            </span>
            <CustomSwitch checked={isYearly} onChange={setIsYearly} />
            <span
              className={`text-base md:text-lg font-medium transition-colors duration-300 ${isYearly ? 'text-gray-900' : 'text-gray-500'
                }`}
            >
              Yearly{' '}
              <span className="text-sm text-green-600 font-semibold">
                (Save {Math.round((1 - 180 / (19.99 * 12)) * 100)}%)
              </span>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="relative bg-white/80 backdrop-blur-lg border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 rounded-2xl overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-semibold text-gray-900">Free</CardTitle>
                <div className="flex items-end mt-2">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-lg text-gray-500 ml-1">/mo</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 mt-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>1 Bot</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 mt-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>1,000 Messages/Month</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-red-400 mt-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Priority Support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4">
                <Link href="/signup" className="w-full">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-transform hover:scale-[1.02] font-semibold">
                    Get Started
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="relative bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-800 border-none shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:-translate-y-2 rounded-2xl overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-xs font-bold px-4 py-1 rounded-bl-lg">
                MOST POPULAR
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-semibold text-white">Pro</CardTitle>
                <div className="flex items-end mt-2">
                  <span className="text-4xl font-bold text-white">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={isYearly ? 'yearly' : 'monthly'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isYearly ? '$180' : '$19.99'}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <span className="text-lg text-gray-200 ml-1">{isYearly ? '/yr' : '/mo'}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 text-gray-200">
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-400 mt-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Up to 3 Bots</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-400 mt-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>10,000 Messages/Month</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-400 mt-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Priority Support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-4">
                <Button
                  className="w-full bg-white text-purple-900 hover:bg-gray-100 rounded-lg transition-transform hover:scale-[1.02] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSubscribe}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    'Subscribe Now'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}