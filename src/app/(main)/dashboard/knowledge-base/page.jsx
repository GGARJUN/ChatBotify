// app/knowledge-base/KnowledgeBasePage.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { getDocuments } from '@/lib/api/documents';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import DocumentUploadDialog from './_components/DocumentUploadDialog';
import DocumentCardList from './_components/DocumentCardList';
import { toast } from 'sonner';

export default function KnowledgeBasePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch documents from API
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('idToken');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const data = await getDocuments(token);
      setDocuments(data || []);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      toast.error('Failed to load documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load documents on mount
  useEffect(() => {
    if (!authLoading && user) {
      fetchDocuments();
    }
  }, [authLoading, user]);

  // Handle upload success — either append or refetch
  const handleUploadSuccess = (newDocument) => {
    // Option 1: Append new document to existing list for instant UI update
    setDocuments((prev) => [...prev, newDocument]);
    toast.success('New document uploaded successfully!');
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
        <DocumentCardList documents={documents} loading={loading} />
      </div>
    </div>
  );
}