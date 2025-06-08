

'use client';

import { useAuth } from '@/context/AuthContext';
import { getDocuments } from '@/lib/api/documents';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaFileAlt, FaUpload } from 'react-icons/fa';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import DocumentCardList from '@/components/documentComponents/DocumentCardList';
import DocumentUploadDialog from '@/components/documentComponents/DocumentUploadDialog';

export default function Documents() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('idToken');
      if (!token) {
        router.push('/auth/login');
        return;
      }
      const data = await getDocuments(token);
      const sortedBots = data.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
      setDocuments(sortedBots || []);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      setError('Failed to load documents. Please try again.');
      toast.error('Failed to load documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchDocuments();
    }
  }, [authLoading, user]);

  const handleUploadSuccess = (newDocument) => {
    setDocuments((prev) => {
      // Check if this is an update to an optimistic document (temp ID)
      const isOptimisticUpdate = prev.some(doc => doc.id === newDocument.id && doc.id.startsWith('temp-'));
      if (isOptimisticUpdate) {
        // Replace the optimistic document with the final one
        return prev.map(doc =>
          doc.id === newDocument.id ? { ...doc, ...newDocument } : doc
        );
      }
      // Otherwise, add the new document to the top of the list
      return [newDocument, ...prev];
    });

    // Show success toast only when the upload is fully complete (not for optimistic update)
    if (!newDocument.isUploading) {
      toast.success('Document uploaded successfully!');
    }
  };

  const handleRetry = () => {
    fetchDocuments();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-500">Upload and manage documents for your bots</p>
        </div>
        <DocumentUploadDialog onSuccess={handleUploadSuccess}>
          <Button className="gap-2">
            <FaUpload className="h-4 w-4" />
            Upload Document
          </Button>
        </DocumentUploadDialog>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={`skeleton-${index}`} className="bg-white p-5 shadow-lg rounded-xl border border-gray-100 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="rounded-full w-14 h-14 bg-gray-200"></div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
            <div className="text-center max-w-md">
              <FaFileAlt className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Error loading documents</h3>
              <p className="mt-1 text-sm text-gray-500">{error}</p>
              <Button onClick={handleRetry} className="mt-4">
                Try Again
              </Button>
            </div>
          </div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center max-w-md">
              <div className="mx-auto h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">
                <FaFileAlt className="text-gray-700 h-10 w-10" />
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No Documents Found!</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by uploading your first document.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Your Documents ({documents.length})
              </h2>
            </div>
            <DocumentCardList documents={documents} loading={loading} />
          </>
        )}
      </div>
    </div>
  );
}