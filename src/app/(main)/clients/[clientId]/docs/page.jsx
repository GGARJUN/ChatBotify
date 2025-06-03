// // app/knowledge-base/KnowledgeBasePage.tsx
// 'use client';

// import { useAuth } from '@/context/AuthContext';
// import { getDocuments } from '@/lib/api/documents';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';
// import DocumentUploadDialog from './_components/DocumentUploadDialog';
// import DocumentCardList from './_components/DocumentCardList';
// import { toast } from 'sonner';

// export default function KnowledgeBasePage() {
//   const router = useRouter();
//   const { user, loading: authLoading } = useAuth();
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch documents from API
//   const fetchDocuments = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('idToken');
//       if (!token) {
//         router.push('/auth/login');
//         return;
//       }

//       const data = await getDocuments(token);
//       setDocuments(data || []);
//     } catch (error) {
//       console.error('Failed to fetch documents:', error);
//       toast.error('Failed to load documents. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load documents on mount
//   useEffect(() => {
//     if (!authLoading && user) {
//       fetchDocuments();
//     }
//   }, [authLoading, user]);

//   // Handle upload success — either append or refetch
//   const handleUploadSuccess = (newDocument) => {
//     // Option 1: Append new document to existing list for instant UI update
//     setDocuments((prev) => [...prev, newDocument]);
//     toast.success('New document uploaded successfully!');
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
//           <p className="text-gray-500">Upload and manage documents for your bots</p>
//         </div>
//         <DocumentUploadDialog onSuccess={handleUploadSuccess} />
//       </div>

//       <div className="mt-8">
//         <h2 className="text-lg font-semibold text-gray-700 mb-4">Your Documents</h2>
//         <DocumentCardList documents={documents} loading={loading} />
//       </div>
//     </div>
//   );
// }


// 'use client';

// import { useAuth } from '@/context/AuthContext';
// import { getDocuments } from '@/lib/api/documents';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';
// import DocumentUploadDialog from './_components/DocumentUploadDialog';
// import DocumentCardList from './_components/DocumentCardList';
// import { toast } from 'sonner';

// export default function KnowledgeBasePage() {
//   const router = useRouter();
//   const { user, loading: authLoading } = useAuth();
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch documents from API
//   const fetchDocuments = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('idToken');
//       const clientId = user?.clientId;

//       if (!token || !clientId) {
//         toast.error('Authentication required. Please log in again.');
//         router.push('/auth/login');
//         return;
//       }

//       // Log auth details for debugging
//       console.log('Auth Context:', { user, clientId, token: token.substring(0, 10) + '...' });

//       const data = await getDocuments(token, clientId);
//       setDocuments(data || []);
//       if (data.length === 0) {
//         toast.info('No documents found for this client ID.');
//       }
//     } catch (error) {
//       console.error('Failed to fetch documents:', error);
//       toast.error(error.message || 'Failed to load documents. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load documents on mount
//   useEffect(() => {
//     if (!authLoading && user) {
//       fetchDocuments();
//     } else if (!authLoading && !user) {
//       toast.error('Please log in to view documents.');
//       router.push('/auth/login');
//     }
//   }, [authLoading, user]);

//   // Handle upload success — refetch documents
//   const handleUploadSuccess = () => {
//     toast.success('New document uploaded successfully!');
//     fetchDocuments(); // Refetch to ensure consistency
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
//           <p className="text-gray-500">Upload and manage documents for your bots</p>
//         </div>
//         <DocumentUploadDialog onSuccess={handleUploadSuccess} />
//       </div>

//       <div className="mt-8">
//         <h2 className="text-lg font-semibold text-gray-700 mb-4">Your Documents</h2>
//         {loading ? (
//           <p>Loading documents...</p>
//         ) : documents.length === 0 ? (
//           <p className="text-gray-500">No documents available for Client ID: {user?.clientId}. Upload a document to get started.</p>
//         ) : (
//           <DocumentCardList documents={documents} loading={loading} />
//         )}
//       </div>
//     </div>
//   );
// }


'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getDocuments } from '@/lib/api/documents';

import { toast } from 'sonner';
import DocumentUploadDialog from '@/app/(main)/dashboard/knowledge-base/_components/DocumentUploadDialog';
import DocumentCardList from '@/app/(main)/dashboard/knowledge-base/_components/DocumentCardList';

export default function DocumentPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('idToken');
      const clientId = user?.clientId;

      if (!token || !clientId) {
        toast.error('Authentication required. Please log in again.');
        router.push('/auth/login');
        return;
      }

      console.log('Auth Context:', { user, clientId, token: token.substring(0, 10) + '...' });

      const data = await getDocuments(token);
      setDocuments(data || []);
      if (data.length === 0) {
        toast.info('No documents found for this client ID.');
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      toast.error(error.message || 'Failed to load documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchDocuments();
    } else if (!authLoading && !user) {
      toast.error('Please log in to view documents.');
      router.push('/auth/login');
    }
  }, [authLoading, user]);

  const handleUploadSuccess = () => {
    toast.success('New document uploaded successfully!');
    fetchDocuments();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-500">Upload and manage documents for your bots</p>
        </div>
        <DocumentUploadDialog onSuccess={handleUploadSuccess} />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Your Documents</h2>
        {loading ? (
          <p>Loading documents...</p>
        ) : documents.length === 0 ? (
          <p className="text-gray-500">
            No documents available for Client ID: {user?.clientId}. Upload a document to get started.
          </p>
        ) : (
          <DocumentCardList documents={documents} loading={loading} />
        )}
      </div>
    </div>
  );
}