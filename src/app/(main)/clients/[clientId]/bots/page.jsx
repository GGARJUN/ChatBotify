"use client";

import { getBots } from "@/lib/api/bots";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { FaDownload, FaLink, FaRobot } from "react-icons/fa6";
import { toast } from "sonner";
import { FiEye } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { IoMdClose } from "react-icons/io";
import { useRouter } from "next/navigation";
import { downloadDocument, getDocuments } from "@/lib/api/documents";
import Link from "next/link";
import CreateBot from "@/components/botComponents/CreateBot";
import { Loader2, X } from "lucide-react";
import { FaFilePdf, FaFileWord } from 'react-icons/fa6';
import { BiSolidFileTxt } from 'react-icons/bi';
import { formatFileSize } from "@/lib/utils";

export default function BotsPage() {
  const [bots, setBots] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);

  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();

  // Fetch bots
  const fetchBots = async () => {
    try {
      const token = localStorage.getItem("idToken");
      if (!token || !user) return logout();

      const response = await getBots(token);
      const fetchedBots = Array.isArray(response) ? response : [];

      const sortedBots = [...fetchedBots].sort((a, b) => {
        const dateA = new Date(a.bot?.createdAt || a.createdAt).getTime();
        const dateB = new Date(b.bot?.createdAt || b.createdAt).getTime();
        return dateB - dateA;
      });

      setBots(sortedBots);
    } catch (error) {
      toast.error("Failed to load bots");
    }
  };

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("idToken");
      if (!token) return router.push("/auth/login");

      const data = await getDocuments(token);
      setDocuments(data || []);
    } catch (error) {
      toast.error("Failed to load documents");
    }
  };

  // Handle document preview
  const handlePreview = async (doc) => {
    try {
      setLoadingId(doc.id);
      const token = localStorage.getItem("idToken");
      if (!token) {
        throw new Error("Session expired. Please login again.");
      }
      if (!doc.s3Url) {
        throw new Error("Document URL not available");
      }

      const { data, filename } = await downloadDocument(doc.s3Url, doc.id, token, true);
      const fileType = doc.fileType || "application/octet-stream";

      let previewUrl = null;
      let previewData = null;

      if (fileType.startsWith("image/") || fileType === "application/pdf") {
        const blob = new Blob([data], { type: fileType });
        previewUrl = URL.createObjectURL(blob);
      } else if (fileType === "text/plain") {
        previewData = new TextDecoder().decode(data);
      }

      setPreviewDoc({
        url: previewUrl,
        filename: doc.name || filename || "Unnamed Document",
        type: fileType,
        data: previewData,
      });

      toast.success("Document loaded for preview");
    } catch (error) {
      toast.error(error.message || "Failed to load document for preview");
    } finally {
      setLoadingId(null);
    }
  };

  // Handle document download
  const handleDownload = async (doc) => {
    try {
      setLoadingId(doc.id);
      const token = localStorage.getItem("idToken");
      if (!token) {
        throw new Error("Session expired. Please login again.");
      }
      if (!doc.s3Url) {
        throw new Error("Document URL not available");
      }

      const { data, filename } = await downloadDocument(doc.s3Url, doc.id, token);
      const url = URL.createObjectURL(new Blob([data], { type: doc.fileType }));
      const link = document.createElement("a");
      link.href = url;
      link.download = doc.name || filename || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Document downloaded successfully");
    } catch (error) {
      toast.error(error.message || "Failed to download document");
    } finally {
      setLoadingId(null);
    }
  };

  const closePreview = () => {
    if (previewDoc?.url) {
      URL.revokeObjectURL(previewDoc.url);
    }
    setPreviewDoc(null);
  };

  // Load on mount
  useEffect(() => {
    if (!authLoading && user) {
      fetchBots();
      fetchDocuments().finally(() => setLoading(false));
    }
  }, [authLoading, user]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (previewDoc?.url && previewDoc.type && !previewDoc.type.startsWith("text/")) {
        URL.revokeObjectURL(previewDoc.url);
      }
    };
  }, [previewDoc]);

  const getFileTypeIcon = (fileType) => {
    switch (fileType) {
      case 'application/pdf':
        return <FaFilePdf className="text-red-500 w-6 h-6 mt-1" />;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return <FaFileWord className="text-blue-600 w-6 h-6 mt-1" />;
      case 'text/plain':
        return <BiSolidFileTxt className="text-green-600 w-7 h-7 mt-1" />;
      default:
        return <span className="text-gray-400 w-6 h-6 mt-1">📄</span>;
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

  // Skeleton Loader
  const SkeletonCard = () => (
    <div className="bg-white p-5 shadow rounded-xl border border-gray-200 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="rounded-full w-14 h-14 bg-gray-200"></div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-gray-100 p-4 rounded-md flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-24"></div>
                <div className="h-2 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 h-9 w-full bg-gray-200 rounded-md"></div>
    </div>
  );


  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Chatbots</h1>
          <p className="text-sm text-gray-500">Create bot and manage documents for your bots</p>
        </div>
        <CreateBot />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
          ))}
        </div>
      ) : (
        <>
          {/* Bot Cards */}
          {bots.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center max-w-md">
                <div className="mx-auto h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">
                  <FaRobot className="text-gray-700 h-10 w-10" />
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No bots created</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first bot.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bots.map((item, index) => {
                const bot = item.bot || item;
                const docs = item.documents || [];

                return (
                  <div
                    key={bot.id || index}
                    className="bg-white p-5 shadow rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200"
                  >
                    {/* Bot Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`rounded-full w-14 h-14 flex justify-center items-center ${bot.status === "ACTIVE" ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600"
                          }`}
                      >
                        <FaRobot className="w-8 h-8" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="font-semibold text-sm md:text-base text-slate-900 truncate">{bot.name}</h2>
                        <h2 className="font-medium text-xs text-slate-500 line-clamp-1">{bot.description}</h2>
                        {/* <p className="text-slate-400 text-xs md:text-sm">
                          {new Date(bot.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p> */}
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <FaLink className="w-3 h-3" />
                          {docs.length > 0 ? (
                            <span>
                              {docs.length} Document{docs.length !== 1 ? "s" : ""} Linked
                            </span>
                          ) : (
                            "No Documents Linked"
                          )}
                        </p>

                      </div>
                      <div>
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap ${bot.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-700'
                            : bot.status === 'DRAFT'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                            }`}
                        >
                          {bot.status}
                        </span>
                      </div>
                    </div>

                    {/* Document List */}
                    <div className="mt-4 space-y-3">
                      {docs.map((doc, docIndex) => (
                        <div
                          key={docIndex}
                          className="bg-slate-50 p-3 rounded-md flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            {getFileTypeIcon(doc.fileType)}
                            <div>
                              <span className="text-sm font-medium truncate max-w-[160px] block">
                                {doc.name}
                              </span>
                              <p className="text-xs text-gray-500 mt-1">
                                <span>{getFileTypeLabel(doc.fileType)} - </span>
                                {formatFileSize(doc.fileSizeBytes)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              aria-label="Preview document"
                              className="p-1 border cursor-pointer border-gray-300 rounded hover:text-blue-500"
                              onClick={() => handlePreview(doc)}
                              disabled={loadingId === doc.id}
                            >
                              {loadingId === doc.id ? (
                                <>
                                  <Loader2 size={14} className='animate-spin' />
                                </>
                              ) : (
                                <FiEye size={14} />
                              )}
                            </button>
                            <button
                              aria-label="Delete document"
                              className="p-1 border cursor-pointer border-gray-300 rounded hover:text-red-500"
                            >
                              <IoMdClose size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Manage Documents Button */}
                    <div className="mt-4">
                      <Link href={`/clients/${user.clientId}/bots/${bot.id}`}>
                        <Button className="w-full py-2 text-sm">Manage Documents</Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          onClick={closePreview}
          role="dialog"
          aria-labelledby="preview-title"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-2xl w-full max-w-[95vw] h-[93vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 id="preview-title" className="text-xl font-semibold text-gray-900 truncate max-w-[70%]">
                {previewDoc.filename}
              </h2>
              <Button
                onClick={closePreview}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-6  flex items-center justify-center"
                aria-label="Close preview"
              >
                <X />
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              {previewDoc.type === "application/pdf" && previewDoc.url && (
                <iframe
                  src={`${previewDoc.url}#toolbar=0`}
                  title={`Preview of ${previewDoc.filename}`}
                  className="w-full h-full border-0"
                  aria-label={`PDF preview of ${previewDoc.filename}`}
                />
              )}
              {previewDoc.type === "text/plain" && previewDoc.data && (
                <pre
                  className="whitespace-pre-wrap break-words p-4 bg-gray-50 rounded-lg text-sm text-gray-800 max-h-full overflow-auto"
                  aria-label={`Text preview of ${previewDoc.filename}`}
                >
                  {previewDoc.data}
                </pre>
              )}
              {previewDoc.type?.startsWith("image/") && previewDoc.url && (
                <div className="flex items-center justify-center h-full">
                  <img
                    src={previewDoc.url}
                    alt={`Preview of ${previewDoc.filename}`}
                    className="max-w-full max-h-full object-contain"
                    aria-label={`Image preview of ${previewDoc.filename}`}
                  />
                </div>
              )}
              {(!previewDoc.url && !previewDoc.data) && (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <BiSolidFileTxt className="text-gray-400 w-16 h-16 mb-4" />
                  <p className="text-gray-600 text-lg mb-4">
                    Preview not available for this file type
                  </p>
                  <Button
                    onClick={() => handleDownload(documents.find((d) => d.name === previewDoc.filename))}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={loadingId !== null}
                    aria-label={`Download ${previewDoc.filename}`}
                  >
                    <FaDownload className="mr-2" />
                    Download File
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