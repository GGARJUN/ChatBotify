// File: components/CancelPage.jsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

export default function CancelPage() {
      const {user} =useAuth();
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const cardVariants = {
    hidden: { x: 0 },
    visible: {
      x: 0,
      transition: {
        duration: 0.5,
        repeat: 2,
        repeatType: 'mirror',
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className=" flex items-center justify-center p-6">
      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className=" w-full"
      >
        <motion.div variants={cardVariants}>
          <Card className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="text-center">
              <motion.div variants={itemVariants}>
                <svg
                  className="w-16 h-16 text-red-400 mx-auto mb-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <CardTitle className="text-3xl font-extrabold text-gray-900">
                  Payment Canceled
                </CardTitle>
              </motion.div>
            </CardHeader>
            <CardContent className="text-center">
              <motion.p
                variants={itemVariants}
                className="text-lg text-gray-600 mb-6"
              >
                No worries! You can try subscribing again anytime or explore our free plan.
              </motion.p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <motion.div variants={itemVariants}>
              <Link href={`/clients/${user.clientId}/pricing`}>
                  <Button
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-transform hover:scale-[1.02] font-semibold text-lg"
                    aria-label="Back to Pricing"
                  >
                    Back to Pricing
                  </Button>
                </Link>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}