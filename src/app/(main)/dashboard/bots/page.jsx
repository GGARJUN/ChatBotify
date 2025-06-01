'use client';

import { getBots } from '@/lib/api/bots';
import CreateBot from './_components/CreateBot';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FaRobot } from 'react-icons/fa6';
import { toast } from 'sonner';
import { FiEye, FiTrash } from 'react-icons/fi';
import { BiSolidFileTxt } from 'react-icons/bi';
import { Button } from '@/components/ui/button';
import { IoMdClose } from 'react-icons/io';
import DocumentUploadDialog from '../knowledge-base/_components/DocumentUploadDialog';
import { FaUpload } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { getDocuments } from '@/lib/api/documents';
import Link from 'next/link';

export default function BotsPage() {
  const [bots, setBots] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();

  // Fetch bots
  const fetchBots = async () => {
    try {
      const token = localStorage.getItem('idToken');
      if (!token || !user) return logout();

      const response = await getBots(token);
      const fetchedBots = Array.isArray(response) ? response : [];

      const sortedBots = [...fetchedBots].sort((a, b) => {
        const dateA = new Date(a.bot?.createdAt || a.createdAt).getTime();
        const dateB = new Date(b.bot?.createdAt || b.createdAt).getTime();
        return dateB - dateA;
      });

      setBots(sortedBots);
      console.log(bots);

    } catch (error) {
      toast.error('Failed to load bots');
    }
  };

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('idToken');
      if (!token) return router.push('/auth/login');

      const data = await getDocuments(token);
      setDocuments(data || []);
    } catch (error) {
      toast.error('Failed to load documents');
    }
  };

  // Load on mount
  useEffect(() => {
    if (!authLoading && user) {
      fetchBots();
      fetchDocuments().finally(() => setLoading(false));
    }
  }, [authLoading, user]);

  // Skeleton Loader
  const SkeletonCard = () => (
    <div className="bg-white p-5 shadow-lg rounded-xl border border-gray-100 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="rounded-full w-14 h-14 bg-gray-200"></div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-gray-100 p-4 rounded-md flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-24"></div>
                <div className="h-2 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 h-9 w-full bg-gray-200 rounded-md"></div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upload Documents</h1>
          <p className="text-gray-500">Upload and manage documents for your bots</p>
        </div>
        {/* <Button onClick={() => setUploadDialogOpen(true)}>
          <FaUpload className="mr-2" /> Upload Document
        </Button> */}
        <DocumentUploadDialog />
      </div>

      {/* <DocumentUploadDialog
        open={uploadDialogOpen}
        onOpenChange={(open) => {
          setUploadDialogOpen(open);
          if (!open) fetchDocuments(); // Refresh after upload
        }}
        botId="V11WFMX"
      /> */}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {[...Array(3)].map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {bots.length === 0 ? (
            <p>No bots found.</p>
          ) : (
            bots.map((item, index) => {
              const bot = item.bot || item;
              const docs = item.documents || [];

              return (
                <div
                  key={bot.id || index}
                  className="bg-white p-5 shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  {/* Bot Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`rounded-full w-14 h-14 flex justify-center items-center ${bot.status === 'ACTIVE' ? 'bg-blue-200/50 text-blue-500' : 'bg-red-200/50 text-red-500'
                        }`}
                    >
                      <FaRobot className="w-8 h-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-sm md:text-base text-slate-900 truncate">{bot.name}</h2>
                      <p className="text-xs text-gray-400">
                        {docs.length > 0 && `${docs.length} Document${docs.length > 1 ? 's' : ''} Linked`}
                      </p>
                    </div>
                  </div>

                  {/* Document List */}
                  <div className="mt-4 space-y-4">
                    {docs.length > 0 ? (
                      docs.map((doc, docIndex) => (
                        <div
                          key={docIndex}
                          className="bg-slate-100 p-4 rounded-md flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <BiSolidFileTxt className="text-green-600 w-8 h-8" />
                            <div>
                              <span className="text-sm font-medium">{doc.name}</span>
                              <p className="text-xs text-gray-500 mt-1">
                                Last updated: {new Date(doc.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              aria-label="View document"
                              className="bg-white p-[2px] border border-slate-300 rounded-sm hover:text-blue-500"
                            >
                              <FiEye size={16} />
                            </button>
                            <button
                              aria-label="Delete document"
                              className="bg-white p-[2px] border border-slate-300 rounded-sm hover:text-red-500"
                            >
                              <IoMdClose size={18} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 italic">No documents available</p>
                    )}
                  </div>

                  {/* Manage Documents Button - Only shown once per bot */}
                  <div className="mt-4">
                    <Link href={`/dashboard/bots/${bot.id}`} passHref>
                      <Button className="w-full">Manage Documents</Button>
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )
      }
    </div >
  );
}