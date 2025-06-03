'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FaFilePdf, FaFileWord, FaDownload } from 'react-icons/fa6';
import { BiSolidFileTxt } from 'react-icons/bi';
import { AiOutlineEye } from 'react-icons/ai';
import { IoArrowBack } from 'react-icons/io5';
import { formatFileSize } from '@/lib/utils';
import { getSingleDocument, downloadDocument } from '@/lib/api/documents';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DocumentIdPage() {
  const router = useRouter();
  const { id } = useParams();
  const [documentData, setDocumentData] = useState(null);
  const { user } = useAuth();
  const [previewDoc, setPreviewDoc] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const token = localStorage.getItem('idToken');
        if (!token || !user) {
          toast.error('Please log in to view document details.', { duration: 3000 });
          router.push('/auth/login');
          return;
        }

        const data = await getSingleDocument(id, token);
        setDocumentData(data);
      } catch (error) {
        console.error('Error fetching document:', error);
        toast.error('Failed to load document details. Please try again.', { duration: 3000 });
        router.push('/dashboard/knowledge-base');
      }
    };

    fetchDocumentDetails();
  }, [id, user, router]);

  const getFileTypeIcon = (fileType) => {
    switch (fileType) {
      case 'application/pdf':
        return <FaFilePdf className="text-red-500 w-12 h-12" />;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return <FaFileWord className="text-blue-600 w-12 h-12" />;
      case 'text/plain':
        return <BiSolidFileTxt className="text-green-600 w-12 h-12" />;
      default:
        return <span className="text-gray-400 text-4xl">📄</span>;
    }
  };

  const getFileTypeLabel = (fileType) => {
    switch (fileType) {
      case 'application/pdf':
        return 'PDF Document';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'Word Document';
      case 'text/plain':
        return 'Text File';
      default:
        return 'Document';
    }
  };

  const handleDownload = async () => {
    try {
      setLoadingAction('download');
      const token = localStorage.getItem('idToken');
      if (!token) {
        throw new Error('Session expired. Please login again.');
      }
      if (!documentData.s3Url) {
        throw new Error('Document URL not available');
      }

      const result = await downloadDocument(documentData.s3Url, documentData.id, token, false);
      if (result === true) {
        toast.success('Document downloaded successfully', { duration: 2000 });
      }
    } catch (error) {
      toast.error(error.message || 'Download failed', { duration: 3000 });
    } finally {
      setLoadingAction(null);
    }
  };

  const handlePreview = async () => {
    try {
      setLoadingAction('preview');
      const token = localStorage.getItem('idToken');
      if (!token) {
        throw new Error('Session expired. Please login again.');
      }
      if (!documentData.s3Url) {
        throw new Error('Document URL not available');
      }

      const { data, filename } = await downloadDocument(documentData.s3Url, documentData.id, token, true);
      const blob = new Blob([data], { type: documentData.fileType });
      const url = URL.createObjectURL(blob);
      setPreviewDoc({ url, filename, type: documentData.fileType, data });
      toast.success('Document loaded for preview', { duration: 2000 });
    } catch (error) {
      toast.error(error.message || 'Preview failed', { duration: 3000 });
    } finally {
      setLoadingAction(null);
    }
  };

  const SkeletonLoader = () => (
    <div className="p-6 max-w-5xl mx-auto animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );

  if (!documentData) {
    return <SkeletonLoader />;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/knowledge-base">
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 mb-4"
            aria-label="Go back to knowledge base"
          >
            <IoArrowBack size={20} className="mr-2" />
            Back to Knowledge Base
          </Button>
        </Link>
        <div className="flex items-center gap-4">
          {getFileTypeIcon(documentData.fileType)}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{documentData.fileName || 'Untitled Document'}</h1>
            <p className="text-sm text-gray-500 mt-2">
              {getFileTypeLabel(documentData.fileType)} • {formatFileSize(documentData.fileSizeBytes)}
            </p>
          </div>
        </div>
      </div>

      {/* Document Details */}
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Document Details</h2>
        {documentData.description ? (
          <p className="text-gray-600 mb-6">{documentData.description}</p>
        ) : (
          <p className="text-gray-600 mb-6 italic">No description provided</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <span className="text-sm font-medium text-gray-500">Created At</span>
            <p className="text-gray-900">
              {new Date(documentData.createdAt).toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Last Updated</span>
            <p className="text-gray-900">
              {new Date(documentData.updatedAt).toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={handlePreview}
            disabled={loadingAction === 'preview'}
            className={`bg-purple-600 hover:bg-purple-700 text-white ${
              loadingAction === 'preview' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Preview document"
          >
            {loadingAction === 'preview' ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full mr-2"></span>
                Loading
              </>
            ) : (
              <>
                <AiOutlineEye size={18} className="mr-2" />
                Preview
              </>
            )}
          </Button>
          <Button
            onClick={handleDownload}
            disabled={loadingAction === 'download'}
            className={`bg-green-600 hover:bg-green-700 text-white ${
              loadingAction === 'download' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Download document"
          >
            {loadingAction === 'download' ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full mr-2"></span>
                Downloading
              </>
            ) : (
              <>
                <FaDownload size={18} className="mr-2" />
                Download
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              URL.revokeObjectURL(previewDoc.url);
              setPreviewDoc(null);
            }
          }}
          role="dialog"
          aria-labelledby="preview-title"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl w-full max-w-[90vw] h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 id="preview-title" className="text-xl font-semibold text-gray-900 truncate max-w-[70%]">
                {previewDoc.filename}
              </h2>
              <Button
                onClick={() => {
                  URL.revokeObjectURL(previewDoc.url);
                  setPreviewDoc(null);
                }}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center"
                aria-label="Close preview"
              >
                ×
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              {previewDoc.type === 'application/pdf' && (
                <iframe
                  src={previewDoc.url}
                  title="Document Preview"
                  className="w-full h-full border-0"
                  aria-label="PDF document preview"
                />
              )}
              {previewDoc.type === 'text/plain' && (
                <pre className="whitespace-pre-wrap break-all p-4 bg-gray-50 rounded-lg text-sm text-gray-800 max-h-full overflow-auto">
                  {new TextDecoder().decode(new Uint8Array(previewDoc.data))}
                </pre>
              )}
              {previewDoc.type.startsWith('image/') && (
                <img
                  src={previewDoc.url}
                  alt="Image Preview"
                  className="w-full h-auto max-h-[80vh] object-contain"
                  aria-label="Image preview"
                />
              )}
              {previewDoc.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && (
                <div className="text-center p-6 bg-gray-100 rounded-lg">
                  <p className="text-gray-600 text-lg">Word document preview is not supported.</p>
                  <Button
                    onClick={handleDownload}
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <FaDownload className="mr-2" />
                    Download to View
                  </Button>
                </div>
              )}
              {![
                'application/pdf',
                'text/plain',
                'image/png',
                'image/jpeg',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              ].includes(previewDoc.type) && (
                <div className="text-center p-6 bg-gray-100 rounded-lg">
                  <p className="text-gray-600 text-lg">Preview not supported for this file type.</p>
                  <Button
                    onClick={handleDownload}
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <FaDownload className="mr-2" />
                    Download to View
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}