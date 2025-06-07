// File: components/SideNavBar.jsx
'use client';

import {
  Avatar,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  LogOut,
  Loader2,
  Bot,
  LayoutDashboard,
  BookOpenText,
  UserRound,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { checkSubscriptionStatus } from '@/lib/api/payment';



export default function SideNavBar() {

  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const [loader, setLoader] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [checkingSub, setCheckingSub] = useState(true);
  const path = usePathname();

  // Navigation links configuration
  const navLinks = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Bots',
      href: user?.clientId ? `/clients/${user.clientId}/bots` : '#',
      icon: Bot,
    },
    {
      name: 'Knowledge Base',
      href: user?.clientId ? `/clients/${user.clientId}/docs` : '#',
      icon: BookOpenText,
    },
    {
      name: 'Profile',
      href: user?.clientId ? `/clients/${user.clientId}/profile` : '#',
      icon: UserRound,
    },
    // {
    //   name: 'Upgrade',
    //   href: user?.clientId ? `/clients/${user.clientId}/pricing` : '#',
    //   icon: UserRound,
    // },
  ];

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [authLoading, user, router]);

  // Check subscription status
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setCheckingSub(false);
        return;
      }

      try {
        const token = localStorage.getItem('idToken');
        if (!token) {
          throw new Error('No authentication token found.');
        }

        const isSubscribed = await checkSubscriptionStatus(token);
        setIsPro(isSubscribed);
        console.log('Updated isPro state:', isSubscribed);
      } catch (error) {
        console.error('Error fetching subscription status:', error.message);
        setIsPro(false);
      } finally {
        setCheckingSub(false);
      }
    };

    fetchSubscription();
  }, [user]);

  const handleLogout = async () => {
    if (loader) return;
    setLoader(true);

    try {
      localStorage.removeItem('idToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      await logout();
      toast.success('Logged out successfully');
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    } finally {
      setLoader(false);
      setLogoutConfirmOpen(false);
    }
  };

  // Show loader during auth & subscription check
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
      </div>
    );
  }

  // Don't render sidebar until user is confirmed
  if (!user) return null;

  return (
    <div className="bg-white/80 backdrop-blur-lg my-3 ml-3 rounded-2xl shadow-2xl px-3 py-2 h-[calc(100vh-1.5rem)] flex flex-col justify-between transition-all duration-300">
      {/* Top Section: User Profile */}
      <div className="flex flex-col gap-6">

        <div className="flex flex-col items-center gap-4 hover:bg-[#5f27cd]/10 p-2 rounded-lg transition-all duration-300">
          <Avatar className="w-16 h-16 border-2 border-[#5f27cd]/20">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          </Avatar>
          <div>
            <h2 className="font-semibold text-lg text-gray-800 text-center">{user?.name || 'User'}</h2>
            <p className="text-sm text-gray-500 truncate  text-center">
              {user?.email || 'No email'}
            </p>
            <div className='flex justify-center items-center mt-2'>
              {checkingSub ? (
                <Loader2 className="w-4 h-4 animate-spin text-gray-500 text-center" />
              ) : (
                <p className={`text-sm font-medium text-center ${isPro ? 'text-green-600' : 'text-yellow-600'}`}>
                  {isPro ? 'Pro Plan' : 'Basic Plan'}
                </p>
              )}
            </div>
            {!isPro && !checkingSub && (
              <Link href={`/clients/${user.clientId}/pricing`} >
                <Button variant="outline" size="sm" className="mt-2 w-full cursor-pointer">
                  Upgrade to Pro
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = path === link.href;

            return (
              <Link key={link.href} href={link.href}>
                <div
                  className={`flex gap-4 items-center py-3 px-4 rounded-lg transition-all duration-300 group ${isActive
                      ? 'bg-[#5f27cd] text-white'
                      : 'hover:bg-[#5f27cd] hover:text-white text-gray-700'
                    }`}
                  onClick={(e) => {
                    if (link.name === 'Bots' && !user.clientId) {
                      e.preventDefault();
                      toast.warning('Client ID not available. Please contact support.');
                    }
                  }}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive
                        ? 'text-white'
                        : 'text-[#5f27cd] group-hover:text-white'
                      } transition-colors duration-300`}
                  />
                  <h2
                    className={`font-medium ${isActive
                        ? 'text-white'
                        : 'group-hover:text-white text-gray-700'
                      }`}
                  >
                    {link.name}
                  </h2>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Logout */}
      <button
        onClick={() => setLogoutConfirmOpen(true)}
        disabled={loader}
        className={`cursor-pointer flex gap-4 items-center py-3 px-4 rounded-lg bg-red-100 hover:bg-red-500 transition-all duration-300 group ${loader ? 'opacity-50 cursor-not-allowed' : ''
          }`}
      >
        {loader ? (
          <Loader2 className="w-5 h-5 text-red-500 animate-spin group-hover:text-white" />
        ) : (
          <LogOut className="w-5 h-5 text-red-500 group-hover:text-white" />
        )}
        <h2 className="font-medium text-red-500 group-hover:text-white">
          {loader ? 'Logging out...' : 'Logout'}
        </h2>
      </button>

      {/* Confirmation Dialog */}
      <Dialog open={logoutConfirmOpen} onOpenChange={setLogoutConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to log out?</p>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setLogoutConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              disabled={loader}
              className="bg-red-500 hover:bg-red-600"
            >
              {loader && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loader ? 'Logging out...' : 'Logout'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}