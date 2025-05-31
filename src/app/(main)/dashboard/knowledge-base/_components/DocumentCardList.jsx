'use client';

import React, { useEffect, useState } from 'react';
import { FaFilePdf } from 'react-icons/fa';
import { FaDownload, FaFileWord } from 'react-icons/fa6';
import { BiSolidFileTxt } from 'react-icons/bi';
import { AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import { formatFileSize } from '@/lib/utils';
import { toast } from 'sonner';
import { downloadDocument } from '@/lib/api/documents';
import Link from 'next/link';

export default function DocumentCardList({ documents = [] }) {
  const [loadingId, setLoadingId] = React.useState(null);
  const [previewDoc, setPreviewDoc] = React.useState(null);


  const handleDownload = async (doc) => {
    try {
      setLoadingId(doc.id);
      const token = localStorage.getItem('authToken'); // Or use context/auth hook
      await downloadDocument(doc.id, token);
    } catch (error) {
      toast.error(error.message || 'Download failed');
    } finally {
      setLoadingId(null);
    }
  };

  // const handlePreview = async (doc) => {
  //   try {
  //     setLoadingId(doc.id);
  //     const token = localStorage.getItem('authToken'); // Or use context/auth hook
  //     const data = await downloadDocument(doc.id, token, true); // Preview mode

  //     // Determine how to display the document based on its type
  //     const fileType = doc.fileName.split('.').pop()?.toLowerCase();
  //     if (fileType === 'pdf') {
  //       // Display PDF in an iframe
  //       setPreviewDoc({
  //         type: 'pdf',
  //         data: URL.createObjectURL(new Blob([data], { type: 'application/pdf' })),
  //       });
  //     } else if (fileType === 'txt') {
  //       // Display text content
  //       const text = new TextDecoder().decode(data);
  //       setPreviewDoc({
  //         type: 'text',
  //         data: text,
  //       });
  //     } else if (fileType === 'doc' || fileType === 'docx') {
  //       // For Word documents, you might need a library like Office.js or fallback to download
  //       toast.info('Word documents are best viewed after download.');
  //       await handleDownload(doc);
  //     } else {
  //       toast.info('Unsupported file type for preview.');
  //     }
  //   } catch (error) {
  //     toast.error(error.message || 'Failed to preview document');
  //   } finally {
  //     setLoadingId(null);
  //   }
  // };


  const getFileTypeIcon = (fileName) => {
    if (!fileName) return null;

    const lowercaseName = fileName.toLowerCase();
    if (lowercaseName.endsWith('.pdf')) {
      return <FaFilePdf className="text-red-500 w-8 h-8 mt-1" />;
    } else if (lowercaseName.endsWith('.doc') || lowercaseName.endsWith('.docx')) {
      return <FaFileWord className="text-blue-600 w-8 h-8 mt-1" />;
    } else if (lowercaseName.endsWith('.txt')) {
      return <BiSolidFileTxt className="text-green-600 w-8 h-8 mt-1" />;
    } else {
      return <span className="text-gray-400 w-8 h-8 mt-1">📄</span>;
    }
  };


  const getFileTypeLabel = (fileName) => {
    if (!fileName) return 'Document';

    const lowercaseName = fileName.toLowerCase();
    if (lowercaseName.endsWith('.pdf')) {
      return 'PDF Document';
    } else if (lowercaseName.endsWith('.doc') || lowercaseName.endsWith('.docx')) {
      return 'Word Document';
    } else if (lowercaseName.endsWith('.txt')) {
      return 'Text File';
    } else {
      return 'Document';
    }
  };


  // const handlePreview = (doc) => {
  //   if (doc.s3Url) {
  //     window.open(doc.s3Url, '_blank');
  //   } else {
  //     toast.error('No preview available for this document');
  //   }
  // };

  const handleDelete = (docId) => {
    // TODO: Call delete API here
    toast.info('Delete functionality coming soon', docId);
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

  if (!documents || documents.length === 0) {
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
        {
          documents.map((doc, index) => (
            <div
              key={index}
              className="bg-white p-5 shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className='flex items-center gap-3'>
                {getFileTypeIcon(doc.fileName)}
                <div>
                  <h3 className="font-bold text-sm md:text-base ">
                    {doc.fileName || 'Untitled Document'}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    <span>{getFileTypeLabel(doc.fileName)} - </span>
                    {formatFileSize(doc.fileSizeBytes)}
                  </p>
                </div>
              </div>
              {doc.description ? (
                <p className="text-sm text-slate-700 mt-2 line-clamp-2">
                  {doc.description}
                </p>
              ) :
                (
                  <span className="text-sm text-slate-700 mt-2 line-clamp-2">{getFileTypeLabel(doc.fileName)}</span>
                )}
              <div className="flex items-start  justify-start gap-5 mt-2">
                <Link href={`/dashboard/knowledge-base/${doc.id}`}>
                  <button
                    aria-label="Preview document"
                    className="text-blue-600  flex items-center gap-2"
                  >
                    <AiOutlineEye size={18} /><span>View</span>
                  </button>
                </Link>
                <button
                  onClick={() => handleDownload(doc)}
                  aria-label="Download document"
                  disabled={loadingId === doc.id}
                  className={`text-green-600 flex items-center gap-2 ${loadingId === doc.id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  {loadingId === doc.id ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full"></span>
                      <span>Downloading...</span>
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
                  className="text-red-600  flex items-center gap-2"
                >
                  <AiOutlineDelete size={18} /><span>Delete</span>
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Modal for previewing documents */}
      {previewDoc && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setPreviewDoc(null);
            }
          }}
        >
          <div className="bg-white p-4 rounded-lg max-w-lg max-h-screen overflow-auto">
            {previewDoc.type === 'pdf' && (
              <iframe
                src={previewDoc.data}
                title="Document Preview"
                width="100%"
                height="100%"
                frameBorder="0"
              ></iframe>
            )}
            {previewDoc.type === 'text' && (
              <pre className="whitespace-pre-wrap break-all">{previewDoc.data}</pre>
            )}
          </div>
        </div>
      )}
    </>
  );
}