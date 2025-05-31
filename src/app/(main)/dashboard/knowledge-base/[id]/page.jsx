'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSingleBot } from '@/lib/api/bots';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getSingleDocument } from '@/lib/api/documents';
import { formatFileSize } from '@/lib/utils';

export default function BotDetailPage() {
  const router = useRouter();
  const { id } = useParams(); // Get bot ID from URL
  const [botData, setBotData] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const token = localStorage.getItem('idToken');
        if (!token || !user) {
          toast.error('Authentication required. Please log in.');
          router.push('/auth/login');
          return;
        }

        const data = await getSingleDocument(id, token); // includeDocs = true
        console.log(id);

        setBotData(data);
      } catch (error) {
        console.error('Error fetching bot:', error.message);
        toast.error('Failed to load bot details');
      }
    };

    fetchDocumentDetails();
  }, [id, user]);

  if (!botData) {
    return <div className="p-6">Loading...</div>;
  }

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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{botData.fileName}</h1>
      <p className="text-sm text-gray-500 mb-6">{botData.description}</p>
      {/* Bot Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <strong>Created At:</strong> {new Date(botData.createdAt).toLocaleString()}
        </div>
        <div>
          <strong>Last Updated:</strong> {new Date(botData.updatedAt).toLocaleString()}
        </div>
        <p className="text-sm text-slate-500 mt-1">
          <span>{getFileTypeLabel(botData.fileName)} - </span>
          {formatFileSize(botData.fileSizeBytes)}
        </p>
      </div>
    </div>
  );
}