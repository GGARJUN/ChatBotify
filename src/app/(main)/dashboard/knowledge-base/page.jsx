// app/knowledge-base/KnowledgeBasePage.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { getDocuments, deleteDocument } from '@/lib/api/documents';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import DocumentUploadDialog from './_components/DocumentUploadDialog';
import DocumentCardList from './_components/DocumentCardList';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { FaUpload } from 'react-icons/fa6';

export default function KnowledgeBasePage() {
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all documents
    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('idToken');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            const data = await getDocuments(token);
            console.log("data", data);

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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
                    <p className="text-gray-500">Upload and manage documents for your bots</p>
                </div>
                {/* <Button
                    onClick={() => setUploadDialogOpen(true)}
                >
                    <FaUpload />
                    Upload Document
                </Button> */}
                <DocumentUploadDialog />
            </div>

            {/* <DocumentUploadDialog
                // open={uploadDialogOpen}
                // onOpenChange={(open) => {
                //     setUploadDialogOpen(open);
                //     if (!open) fetchDocuments(); // Refresh documents after upload
                // }}
                // botId="V11WFMX"
            /> */}

            <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Your Documents</h2>
                <DocumentCardList
                    documents={documents}
                />
            </div>
        </div>
    );
}


// onDelete={handleDelete}
// Delete a document
// const handleDelete = async (documentId) => {
//     try {
//         const token = localStorage.getItem('idToken');
//         if (!token) {
//             toast.error('Authentication required.');
//             return;
//         }

//         await deleteDocument(documentId, token);
//         toast.success('Document deleted successfully');
//         fetchDocuments(); // Refresh documents
//     } catch (error) {
//         console.error('Error deleting document:', error.message);
//         toast.error('Failed to delete document');
//     }
// };