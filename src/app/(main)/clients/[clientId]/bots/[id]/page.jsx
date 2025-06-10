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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
        return <FaFilePdf className="text-red-500 w-8 h-8 transition-transform group-hover:scale-110" />;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return <FaFileWord className="text-blue-600 w-8 h-8 transition-transform group-hover:scale-110" />;
      case 'text/plain':
        return <BiSolidFileTxt className="text-green-600 w-8 h-8 transition-transform group-hover:scale-110" />;
      default:
        return <span className="text-gray-400 text-2xl group-hover:scale-110">📄</span>;
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
      await grantDocumentAccess(botId, selectedDocId, user?.clientId || localStorage.getItem('clientId'), token);
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
    <Card className="p-6 shadow-lg animate-pulse bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-6"></div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-48"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    </Card>
  );

  if (!botData) {
    return <div className="max-w-7xl mx-auto p-6"><SkeletonLoader /></div>;
  }

  const { bot, documents = [] } = botData;
  const availableDocuments = allDocuments.filter(
    (doc) => !documents.some((linkedDoc) => linkedDoc.id === doc.id)
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-6 rounded-xl shadow-md">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{bot.name}</h1>
          <p className="text-md font-medium text-gray-600">{bot.description}</p>
          <p className="text-sm text-gray-400">
            Updated: {new Date(bot.updatedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className="text-sm text-gray-500 mt-1 max-w-md">
            Manage documents to enhance your bot’s knowledge base with rich, contextual data.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold shadow-sm transition-all duration-300 ${
              bot.status === 'ACTIVE'
                ? 'bg-green-100 text-green-700 ring-1 ring-green-200 hover:bg-green-200'
                : bot.status === 'DRAFT'
                ? 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200 hover:bg-yellow-200'
                : 'bg-red-100 text-red-700 ring-1 ring-red-200 hover:bg-red-200'
            }`}
          >
            {bot.status}
          </span>
        </div>
      </div>

      {/* Document Associations Section */}
      <Card className="p-8 shadow-lg border border-gray-100 bg-white rounded-xl">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="text-2xl font-semibold text-gray-900">
            Document Associations
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Link or unlink documents to customize your bot’s knowledge resources.
          </p>
        </CardHeader>
        <CardContent className="p-0 space-y-8">
          {/* Currently Linked Documents */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Linked Documents</h3>
            {documents.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="group flex items-center justify-between bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-100 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      {getFileTypeIcon(doc.fileType)}
                      <div>
                        <h4 className="font-semibold text-gray-900 truncate">
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
                      className={`text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors ${
                        isProcessing === doc.accessId ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      aria-label={`Unlink ${doc.name || 'document'}`}
                    >
                      <FiTrash size={16} className="mr-2" />
                      Unlink
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500">No documents currently linked.</p>
              </div>
            )}
          </div>

          {/* Available Documents to Link */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Documents</h3>
            {availableDocuments.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableDocuments.map((doc) => (
                  <li
                    key={doc.id}
                    className="group flex items-center justify-between bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-100 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      {getFileTypeIcon(doc.fileType)}
                      <div>
                        <h4 className="font-semibold text-gray-900 truncate">
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
                      className={`text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors ${
                        isProcessing === doc.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      aria-label={`Link ${doc.fileName || 'document'}`}
                    >
                      <FiLink size={16} className="mr-2" />
                      Link
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500">No documents available to link.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Link Confirmation Dialog */}
      <Dialog open={showLinkConfirm} onOpenChange={setShowLinkConfirm}>
        <DialogContent className="sm:max-w-md rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Link Document</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to link this document to the bot? This will allow the bot to access its content.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setShowLinkConfirm(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmLink}
              disabled={isProcessing}
              className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
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
        <DialogContent className="sm:max-w-md rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Unlink Document</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to remove this document from the bot? This will revoke its access.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setShowUnlinkConfirm(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmUnlink}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700 text-white transition-colors"
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