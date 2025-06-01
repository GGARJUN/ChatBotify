'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FiLink, FiTrash } from 'react-icons/fi';
import { FaFilePdf, FaFileWord } from 'react-icons/fa6';
import { BiSolidFileTxt } from 'react-icons/bi';
import { formatFileSize } from '@/lib/utils';
import { getSingleBot } from '@/lib/api/bots';
import { getDocuments, grantDocumentAccess, revokeDocumentAccess } from '@/lib/api/documents';
import { useAuth } from '@/context/AuthContext';

export default function BotDetailPage() {
  const router = useRouter();
  const { id: botId } = useParams();
  const [botData, setBotData] = useState(null);
  const { user } = useAuth();
  const [allDocuments, setAllDocuments] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchBotDetails = async () => {
    try {
      const token = localStorage.getItem('idToken');
      if (!token || !user) {
        toast.error('Authentication required. Please log in.');
        router.push('/auth/login');
        return;
      }

      const data = await getSingleBot(botId, token, true);
      setBotData(data);
    } catch (error) {
      console.error('Error fetching bot:', error.message);
      toast.error('Failed to load bot details');
      router.push('/dashboard');
    }
  };

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('idToken');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const data = await getDocuments(token);
      setAllDocuments(data || []);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      toast.error('Failed to load documents. Please try again.');
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchBotDetails();
  }, [botId, user]);

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

  const handleLink = async (documentId) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const token = localStorage.getItem('idToken');
      if (!token) {
        toast.error('Authentication required');
        router.push('/auth/login');
        return;
      }

      await grantDocumentAccess(
        botId,
        documentId,
        user?.clientId || localStorage.getItem('clientId'),
        token
      );

      toast.success('Document linked successfully');
      fetchBotDetails();
      fetchDocuments();

    } catch (error) {
      console.error('Error linking document:', error);
      toast.error(error.message || 'Failed to link document');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnlink = async (accessId) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const token = localStorage.getItem('idToken');
      if (!token) {
        toast.error('Authentication required');
        router.push('/auth/login');
        return;
      }

      await revokeDocumentAccess(accessId, token);

      toast.success('Document unlinked successfully');
      fetchBotDetails();
      fetchDocuments();

    } catch (error) {
      console.error('Error unlinking document:', error);
      toast.error(error.message || 'Failed to unlink document');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!botData) {
    return <div className="p-6">Loading...</div>;
  }

  const { bot, documents = [] } = botData;

  const availableDocuments = allDocuments.filter(
    (doc) => !documents.some((linkedDoc) => linkedDoc.id === doc.id)
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{bot.name}</h1>
        <p className="text-sm text-gray-500">Manage document associations</p>
      </div>

      {/* Document Associations Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Document Associations</h2>
        <p className="text-sm text-gray-500 mb-6">
          Link or unlink documents to enhance your bot's knowledge base.
        </p>

        {/* Currently Linked Documents */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Currently Linked Documents</h3>
          <ul className="space-y-4">
            {documents.length > 0 ? (
              documents.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between bg-gray-100 p-4 rounded">
                  <div className="flex items-center gap-3">
                    {getFileTypeIcon(doc.name)}
                    <div>
                      <h3 className="font-bold text-sm md:text-base">
                        {doc.name || 'Untitled Document'}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        <span>{getFileTypeLabel(doc.name)} - </span>
                        {formatFileSize(doc.fileSizeBytes)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnlink(doc.accessId)}
                    disabled={isProcessing}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1 disabled:opacity-50"
                  >
                    <FiTrash size={16} /> Unlink
                  </button>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500">No documents currently linked.</p>
            )}
          </ul>
        </div>

        {/* Available Documents to Link */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Available Documents to Link</h3>
          <ul className="space-y-4">
            {availableDocuments.length > 0 ? (
              availableDocuments.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between bg-gray-100 p-4 rounded">
                  <div className="flex items-center gap-3">
                    {getFileTypeIcon(doc.fileName)}
                    <div>
                      <h3 className="font-bold text-sm md:text-base">
                        {doc.name || 'Untitled Document'}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        <span>{getFileTypeLabel(doc.fileName)} - </span>
                        {formatFileSize(doc.fileSizeBytes)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleLink(doc.id)}
                    disabled={isProcessing}
                    className="text-blue-500 hover:text-blue-700 flex items-center gap-1 disabled:opacity-50"
                  >
                    <FiLink size={16} /> Link
                  </button>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500">No documents available to link.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}