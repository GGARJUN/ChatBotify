'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  LogOut,
  Loader2,
  Bot,
  LayoutDashboard,
  BookOpenText,
  UserRound,
} from 'lucide-react';
import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function SideNavBar() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const [loader, setLoader] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [authLoading, user, router]);

  const handleLogout = async (e) => {
    e.preventDefault();

    if (loader) return; // Prevent double click
    setLoader(true);

    try {
      // Clear localStorage tokens
      localStorage.removeItem('idToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      // Call context logout method
      await logout(); // optional: may also call API if needed

      toast.success('You have been logged out successfully');

      // Redirect to login page
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Unable to log out. Please try again.');
    } finally {
      setLoader(false);
      setLogoutConfirmOpen(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg my-3 ml-3 rounded-2xl shadow-2xl px-3 py-2 h-[calc(100vh-1.5rem)] flex flex-col justify-between transition-all duration-300">
      {/* Top Section: User Profile */}
      <div className="flex flex-col gap-6 cursor-pointer">
        <Link href="/" className="w-full">
          <div className="flex items-center gap-4 hover:bg-[#5f27cd]/10 p-2 rounded-lg transition-all duration-300">
            <Avatar className="w-14 h-14 border-2 border-[#5f27cd]/20">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            </Avatar>
            <div>
              <h2 className="font-semibold text-lg text-gray-800">
                {user?.name || 'User'}
              </h2>
              <p className="text-sm text-gray-500 truncate max-w-[140px]">
                {user?.email || 'No email'}
              </p>
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1">
          <Link href="/dashboard">
            <div className="flex gap-4 items-center py-3 px-4 rounded-lg hover:bg-[#5f27cd] hover:text-white transition-all duration-300 group">
              <LayoutDashboard className="w-5 h-5 text-[#5f27cd] group-hover:text-white transition-colors duration-300" />
              <h2 className="font-medium text-gray-700 group-hover:text-white">Dashboard</h2>
            </div>
          </Link>
          <Link href="/dashboard/bots">
            <div className="flex gap-4 items-center py-3 px-4 rounded-lg hover:bg-[#5f27cd] hover:text-white transition-all duration-300 group">
              <Bot className="w-5 h-5 text-[#5f27cd] group-hover:text-white transition-colors duration-300" />
              <h2 className="font-medium text-gray-700 group-hover:text-white">Bots</h2>
            </div>
          </Link>
          <Link href="/dashboard/knowledge-base">
            <div className="flex gap-4 items-center py-3 px-4 rounded-lg hover:bg-[#5f27cd] hover:text-white transition-all duration-300 group">
              <BookOpenText className="w-5 h-5 text-[#5f27cd] group-hover:text-white transition-colors duration-300" />
              <h2 className="font-medium text-gray-700 group-hover:text-white">Knowledge Base</h2>
            </div>
          </Link>
          <Link href="/dashboard/profile">
            <div className="flex gap-4 items-center py-3 px-4 rounded-lg hover:bg-[#5f27cd] hover:text-white transition-all duration-300 group">
              <UserRound className="w-5 h-5 text-[#5f27cd] group-hover:text-white transition-colors duration-300" />
              <h2 className="font-medium text-gray-700 group-hover:text-white">Profile</h2>
            </div>
          </Link>
        </nav>
      </div>

      {/* Bottom Section: Logout */}
      <button
       onClick={() => setLogoutConfirmOpen(true)}
        disabled={loader}
        className={`flex gap-4 items-center py-3 px-4 rounded-lg bg-red-100 hover:bg-red-500  transition-all duration-300 group ${loader ? 'opacity-50 cursor-not-allowed' : ''
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
      {/* Confirmation Dialog using shadcn/ui */}
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