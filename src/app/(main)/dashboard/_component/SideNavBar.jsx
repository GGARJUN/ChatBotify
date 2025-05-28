'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Loader2, Bot, LayoutDashboard, BookOpenText, UserRound } from 'lucide-react';
import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function SideNavBar() {
    const router = useRouter();
    const { logout } = useAuth(); // ✅ This handles clearing user state
    const [loader, setLoader] = useState(false);
  
    const handleLogout = async (e) => {
      e.preventDefault(); // Prevent default if used inside Link/form
      setLoader(true);
  
      try {
        // Optional: Call your backend/logout API if needed
        // await authServices.logout(); // only if necessary
  
        // ✅ Clear localStorage tokens
        localStorage.removeItem('idToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
  
        // ✅ Call context logout method to update global state
        logout();
  
        // ✅ Show success message
        toast.success('You have been logged out successfully');
  
        // ✅ Redirect to homepage or login page
        router.push('/'); // or '/login'
      } catch (error) {
        console.error('Logout error:', error);
        toast.error('Unable to logout. Please try again later.');
      } finally {
        setLoader(false);
      }
    };
    return (
        <div className="bg-white/80 backdrop-blur-lg my-3 ml-3 rounded-2xl shadow-2xl px-3 py-2 h-[calc(100vh-1.5rem)] flex flex-col justify-between transition-all duration-300">
            {/* Top Section: User Profile */}
            <div className="flex flex-col gap-6 cursor-pointer">
                <Link href="/">
                    <div className="flex items-center gap-4 hover:bg-[#5f27cd]/10 p-2 rounded-lg transition-all duration-300">
                        <Avatar className="w-14 h-14 border-2 border-[#5f27cd]/20">
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        </Avatar>
                        <div>
                            <h2 className="font-semibold text-lg text-gray-800">Alex Johnson</h2>
                            <p className="text-sm text-gray-500">alex@b2b.com</p>
                        </div>
                    </div>
                </Link>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-3">
                    <Link href="/dashboard">
                        <div className="flex gap-4 items-center cursor-pointer py-3 px-4 rounded-lg hover:bg-[#5f27cd] hover:text-white transition-all duration-300 group">
                            <LayoutDashboard className="w-5 h-5 text-[#5f27cd] group-hover:text-white transition-colors duration-300" />
                            <h2 className="font-medium text-gray-700 group-hover:text-white">Dashboard</h2>
                        </div>
                    </Link>
                    <Link href="/bots">
                        <div className="flex gap-4 items-center cursor-pointer py-3 px-4 rounded-lg hover:bg-[#5f27cd] hover:text-white transition-all duration-300 group">
                            <Bot className="w-5 h-5 text-[#5f27cd] group-hover:text-white transition-colors duration-300" />
                            <h2 className="font-medium text-gray-700 group-hover:text-white">Bots</h2>
                        </div>
                    </Link>
                    <Link href="/dashboard/knowledge-base">
                        <div className="flex gap-4 items-center cursor-pointer py-3 px-4 rounded-lg hover:bg-[#5f27cd] hover:text-white transition-all duration-300 group">
                            <BookOpenText className="w-5 h-5 text-[#5f27cd] group-hover:text-white transition-colors duration-300" />
                            <h2 className="font-medium text-gray-700 group-hover:text-white">Knowledge Base</h2>
                        </div>
                    </Link>
                    <Link href="/dashboard/profile">
                        <div className="flex gap-4 items-center cursor-pointer py-3 px-4 rounded-lg hover:bg-[#5f27cd] hover:text-white transition-all duration-300 group">
                            <UserRound className="w-5 h-5 text-[#5f27cd] group-hover:text-white transition-colors duration-300" />
                            <h2 className="font-medium text-gray-700 group-hover:text-white">Profile</h2>
                        </div>
                    </Link>
                </nav>
            </div>

            {/* Bottom Section: Logout */}
            <div
                onClick={handleLogout}
                className={`flex gap-4 items-center cursor-pointer py-3 px-4 rounded-lg bg-red-100 hover:bg-red-500 hover:text-white transition-all duration-300 group ${loader ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
            >
                {loader ? (
                    <Loader2 className="w-5 h-5 text-red-500 animate-spin group-hover:text-white transition-colors duration-300" />
                ) : (
                    <LogOut className="w-5 h-5 text-red-500 group-hover:text-white transition-colors duration-300" />
                )}
                <h2 className="font-medium text-red-500 group-hover:text-white">
                    {loader ? 'Logging out...' : 'Logout'}
                </h2>
            </div>
        </div>
    );
}

export default SideNavBar;