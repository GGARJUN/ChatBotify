'use client';

import React from 'react';
import { FaFilePdf, FaFileWord, FaDownload } from 'react-icons/fa6';
import { BiSolidFileTxt } from 'react-icons/bi';
import { AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import { formatFileSize } from '@/lib/utils';
import { toast } from 'sonner';
import { downloadDocument } from '@/lib/api/documents';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export default function DocumentCardList({ documents = [], loading = false }) {
  const [loadingId, setLoadingId] = React.useState(null);
  const [previewDoc, setPreviewDoc] = React.useState(null);
  const { user } = useAuth();

  const handleDownload = async (doc) => {
    try {
      setLoadingId(doc.id);
      const token = localStorage.getItem('idToken');
      if (!token) {
        throw new Error('Session expired. Please login again.');
      }
      if (!doc.s3Url) {
        throw new Error('Document URL not available');
      }

      const result = await downloadDocument(doc.s3Url, doc.id, token, false);
      if (result === true) {
        toast.success('Document downloaded successfully');
      }
    } catch (error) {
      toast.error(error.message || 'Download failed');
    } finally {
      setLoadingId(null);
    }
  };

  const handlePreview = async (doc) => {
    try {
      setLoadingId(doc.id);
      const token = localStorage.getItem('idToken');
      if (!token) {
        throw new Error('Session expired. Please login again.');
      }
      if (!doc.s3Url) {
        throw new Error('Document URL not available');
      }

      const { data, filename } = await downloadDocument(doc.s3Url, doc.id, token, true);
      const blob = new Blob([data], { type: doc.fileType });
      const url = URL.createObjectURL(blob);
      setPreviewDoc({ url, filename, type: doc.fileType });
      toast.success('Document loaded for preview');
    } catch (error) {
      toast.error(error.message || 'Preview failed');
    } finally {
      setLoadingId(null);
    }
  };

  const getFileTypeIcon = (fileType) => {
    switch (fileType) {
      case 'application/pdf':
        return <FaFilePdf className="text-red-500 w-8 h-8 mt-1" />;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return <FaFileWord className="text-blue-600 w-8 h-8 mt-1" />;
      case 'text/plain':
        return <BiSolidFileTxt className="text-green-600 w-8 h-8 mt-1" />;
      default:
        return <span className="text-gray-400 w-8 h-8 mt-1">📄</span>;
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

  const SkeletonCard = () => (
    <div className="bg-white p-5 shadow-lg rounded-xl border border-gray-100 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="rounded-full w-14 h-14 bg-gray-200"></div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-6 w-16 bg-gray-200 rounded-md"></div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="flex items-center justify-start gap-6 mt-4">
        <div className="h-5 w-12 bg-gray-200 rounded"></div>
        <div className="h-5 w-14 bg-gray-200 rounded"></div>
        <div className="h-5 w-12 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <SkeletonCard key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }
  
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-white p-5 shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              {getFileTypeIcon(doc.fileType)}
              <div>
                <h3 className="font-bold text-sm md:text-base">{doc.fileName || 'Untitled Document'}</h3>
                <p className="text-sm text-slate-500 mt-1">
                  <span>{getFileTypeLabel(doc.fileType)} - </span>
                  {formatFileSize(doc.fileSizeBytes)}
                </p>
              </div>
            </div>
            {doc.description ? (
              <p className="text-sm text-slate-700 mt-2 line-clamp-2">{doc.description}</p>
            ) : (
              <span className="text-sm text-slate-700 mt-2 line-clamp-2">
                {getFileTypeLabel(doc.fileType)}
              </span>
            )}
            <div className="flex items-start justify-start gap-5 mt-2">
              <Link href={`/clients/${user.clientId}/docs/${doc.id}`}>
                <button
                  aria-label="View document"
                  className="text-blue-600 flex items-center gap-2"
                >
                  <AiOutlineEye size={18} />
                  <span>View</span>
                </button>
              </Link>
              <button
                onClick={() => handlePreview(doc)}
                aria-label="Preview document"
                disabled={loadingId === doc.id}
                className={`text-green-600 flex items-center gap-2 ${
                  loadingId === doc.id ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loadingId === doc.id ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full"></span>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <FaDownload size={18} />
                    <span>Download</span>
                  </>
                )}
              </button>
              <button
                onClick={() => handleDelete(doc.id)}
                aria-label="Delete document"
                disabled={loadingId === doc.id}
                className={`text-red-600 flex items-center gap-2 ${
                  loadingId === doc.id ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <AiOutlineDelete size={18} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

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
                &times;
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
                  <p className="text-gray-600 text-lg">
                    Word document preview is not supported.
                  </p>
                  <Button
                    onClick={() => handleDownload(documents.find((doc) => doc.fileName === previewDoc.filename))}
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
                  <p className="text-gray-600 text-lg">
                    Preview not supported for this file type.
                  </p>
                  <Button
                    onClick={() => handleDownload(documents.find((doc) => doc.fileName === previewDoc.filename))}
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
    </>
  );
}