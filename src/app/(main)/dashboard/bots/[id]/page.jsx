'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FiLink, FiTrash } from 'react-icons/fi';
import { FaFilePdf, FaFileWord } from 'react-icons/fa6';
import { BiSolidFileTxt } from 'react-icons/bi';
import { formatFileSize } from '@/lib/utils';
import { getSingleBot } from '@/lib/api/bots';
import { getDocuments, grantDocumentAccess, revokeDocumentAccess } from '@/lib/api/documents';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export default function BotDetailPage() {
  const router = useRouter();
  const { id: botId } = useParams();
  const [botData, setBotData] = useState(null);
  const { user } = useAuth();
  const [allDocuments, setAllDocuments] = useState([]);
  const [isProcessing, setIsProcessing] = useState(null);
  const [showLinkConfirm, setShowLinkConfirm] = useState(false);
  const [showUnlinkConfirm, setShowUnlinkConfirm] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [selectedAccessId, setSelectedAccessId] = useState(null);

  const fetchBotDetails = async () => {
    try {
      const token = localStorage.getItem('idToken');
      if (!token || !user) {
        toast.error('Please log in to view bot details.', { duration: 3000 });
        router.push('/auth/login');
        return;
      }

      const data = await getSingleBot(botId, token, true);
      console.log('Bot with Doc Data',data);
      setBotData(data);
    } catch (error) {
      console.error('Error fetching bot:', error);
      toast.error('Failed to load bot details. Please try again.', { duration: 3000 });
      router.push('/dashboard');
    }
  };

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('idToken');
      if (!token) {
        toast.error('Please log in to view documents.', { duration: 3000 });
        router.push('/auth/login');
        return;
      }

      const data = await getDocuments(token);
      setAllDocuments(data || []);
      console.log('doc Data',data);
      
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      toast.error('Failed to load documents. Please try again.', { duration: 3000 });
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchBotDetails();
  }, [botId, user]);

  const getFileTypeIcon = (fileType) => {
    switch (fileType) {
      case 'application/pdf':
        return <FaFilePdf className="text-red-500 w-10 h-10" />;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return <FaFileWord className="text-blue-600 w-10 h-10" />;
      case 'text/plain':
        return <BiSolidFileTxt className="text-green-600 w-10 h-10" />;
      default:
        return <span className="text-gray-400 text-3xl">📄</span>;
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

  const handleLink = (documentId) => {
    setSelectedDocId(documentId);
    setShowLinkConfirm(true);
  };

  const confirmLink = async () => {
    if (!selectedDocId || isProcessing) return;
    setIsProcessing(selectedDocId);

    try {
      const token = localStorage.getItem('idToken');
      if (!token) {
        toast.error('Please log in to link documents.', { duration: 3000 });
        router.push('/auth/login');
        return;
      }

      await grantDocumentAccess(
        botId,
        selectedDocId,
        user?.clientId || localStorage.getItem('clientId'),
        token
      );
      toast.success('Document linked successfully', { duration: 2000 });
      await Promise.all([fetchBotDetails(), fetchDocuments()]);
    } catch (error) {
      console.error('Error linking document:', error);
      toast.error(error.message || 'Failed to link document', { duration: 3000 });
    } finally {
      setIsProcessing(null);
      setShowLinkConfirm(false);
      setSelectedDocId(null);
    }
  };

  const handleUnlink = (accessId) => {
    setSelectedAccessId(accessId);
    setShowUnlinkConfirm(true);
  };

  const confirmUnlink = async () => {
    if (!selectedAccessId || isProcessing) return;
    setIsProcessing(selectedAccessId);

    try {
      const token = localStorage.getItem('idToken');
      if (!token) {
        toast.error('Please log in to unlink documents.', { duration: 3000 });
        router.push('/auth/login');
        return;
      }

      await revokeDocumentAccess(selectedAccessId, token);
      toast.success('Document unlinked successfully', { duration: 2000 });
      await Promise.all([fetchBotDetails(), fetchDocuments()]);
    } catch (error) {
      console.error('Error unlinking document:', error);
      toast.error(error.message || 'Failed to unlink document', { duration: 3000 });
    } finally {
      setIsProcessing(null);
      setShowUnlinkConfirm(false);
      setSelectedAccessId(null);
    }
  };

  const SkeletonLoader = () => (
    <div className="bg-white p-6 rounded-xl shadow-md animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between bg-gray-100 p-4 rounded">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-40"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <div className="h-6 w-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );

  if (!botData) {
    return (
      <div className="p-6">
        <SkeletonLoader />
      </div>
    );
  }

  const { bot, documents = [] } = botData;
  const availableDocuments = allDocuments.filter(
    (doc) => !documents.some((linkedDoc) => linkedDoc.id === doc.id)
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">{bot.name}</h1>
        <p className="text-sm text-gray-500 mt-2">
          Manage documents associated with your bot to enhance its knowledge base.
        </p>
      </div>

      {/* Document Associations Section */}
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Document Associations</h2>
        <p className="text-sm text-gray-600 mb-8">
          Link or unlink documents to customize your bot’s knowledge resources.
        </p>

        {/* Currently Linked Documents */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Currently Linked Documents</h3>
          {documents.length > 0 ? (
            <ul className="space-y-4">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {getFileTypeIcon(doc.fileType)}
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {doc.name || 'Untitled Document'}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {getFileTypeLabel(doc.fileType)} • {formatFileSize(doc.fileSizeBytes)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnlink(doc.accessId)}
                    disabled={isProcessing === doc.accessId}
                    className={`text-red-600 hover:text-red-800 hover:bg-red-50 cursor-pointer ${isProcessing === doc.accessId ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    aria-label={`Unlink ${doc.fileName || 'document'}`}
                  >
                        <FiTrash size={16} className="mr-1" />
                        Unlink
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">No documents currently linked.</p>
            </div>
          )}
        </div>

        {/* Available Documents to Link */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Documents to Link</h3>
          {availableDocuments.length > 0 ? (
            <ul className="space-y-4">
              {availableDocuments.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {getFileTypeIcon(doc.fileType)}
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {doc.fileName || 'Untitled Document'}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {getFileTypeLabel(doc.fileType)} • {formatFileSize(doc.fileSizeBytes)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLink(doc.id)}
                    disabled={isProcessing === doc.id}
                    className={`text-blue-600 hover:text-blue-800 hover:bg-blue-50 cursor-pointer${isProcessing === doc.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    aria-label={`Link ${doc.fileName || 'document'}`}
                  >
                        <FiLink size={16} className="mr-1" />
                        Link
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">No documents available to link.</p>
            </div>
          )}
        </div>
      </div>

      {/* Link Confirmation Dialog */}
      <Dialog open={showLinkConfirm} onOpenChange={setShowLinkConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to link this document to the bot? This will allow the bot to access it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLinkConfirm(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmLink}
              disabled={isProcessing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing && (
                <span className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full mr-2"></span>
              )}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unlink Confirmation Dialog */}
      <Dialog open={showUnlinkConfirm} onOpenChange={setShowUnlinkConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlink Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this document from the bot? This will revoke its access.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUnlinkConfirm(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmUnlink}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing && (
                <span className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full mr-2"></span>
              )}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}