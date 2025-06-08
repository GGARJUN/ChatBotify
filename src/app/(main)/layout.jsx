"use client";
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import SideNavBar from '@/components/dashboardComponents/SideNavBar';

function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();

  // useEffect(() => {
  //   if (!authLoading && !user ) {

  //     logout()
  //     router.push('/auth/login');
  //   }
  // }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }


  return (
    <div className=" ">
      {/* Top Bar for Mobile */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow-md">
        <h1 className="text-xl font-bold text-[#5f27cd]">Chatbotify</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <Menu className="w-6 h-6 text-[#5f27cd]" />
        </button>
      </div>

      {/* Sidebar and Main Content Wrapper */}
      <div className="flex h-full">
        {/* Mobile Sidebar */}
        {/* <div
          className={`fixed inset-y-0 left-0 z-50 w-64 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:hidden transition-transform duration-300 ease-in-out bg-white/80 backdrop-blur-lg shadow-xl`}
        >
          <SideNavBar />
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-4 right-4 text-[#5f27cd]"
          >
            <X className="w-6 h-6" />
          </button>
        </div> */}

        {/* Desktop Sidebar */}
        <div className="hidden md:block md:w-72 fixed h-screen">
          <SideNavBar />
        </div>

        {/* Main Content */}
        <div className="flex-1 md:ml-72  px-3 py-3 ">
          <div className="px-6 py-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
