// File: components/SuccessPage.jsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import Confetti from 'react-confetti';
import { useState, useEffect } from 'react';

export default function SuccessPage() {
  const [showConfetti, setShowConfetti] = useState(true);

  // Stop confetti after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div className=" flex items-center justify-center p-6">
      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <Confetti
            width={typeof window !== 'undefined' ? window.innerWidth : 800}
            height={typeof window !== 'undefined' ? window.innerHeight : 600}
            recycle={false}
            numberOfPieces={200}
            gravity={0.2}
            colors={['#5f27cd', '#4f46e5', '#818cf8', '#facc15', '#f97316']}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className=" w-full"
      >
        <Card className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="text-center">
            <motion.div variants={itemVariants}>
              <CheckCircle2
                className="w-16 h-16 text-green-500 mx-auto mb-4"
                strokeWidth={2.5}
              />
              <CardTitle className="text-3xl font-extrabold text-gray-900">
                Payment Successful!
              </CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent className="text-center">
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-600 mb-6"
            >
              Thank you for subscribing to our Pro plan. You're now ready to unlock advanced features!
            </motion.p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <motion.div variants={itemVariants}>
              <Link href="/dashboard">
                <Button
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-transform hover:scale-[1.02] font-semibold text-lg"
                  aria-label="Go to Dashboard"
                >
                  Go to Dashboard
                </Button>
              </Link>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}