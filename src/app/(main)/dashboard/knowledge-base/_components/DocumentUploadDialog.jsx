'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import DocumentForm from './DocumentForm';
import { toast } from 'sonner';
import { FaUpload } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { uploadFileToS3, createDocumentRecord } from '@/lib/api/documents';
import { useState } from 'react';

export default function DocumentUploadDialog({ onSuccess }) {
  const router = useRouter();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const handleSubmit = async (fileData, setLoading) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('idToken');
      const clientId = user?.clientId || localStorage.getItem('clientId');
  
      if (!token) {
        toast.error('Session expired. Please login again.');
        router.push('/auth/login');
        return;
      }
  
      if (!clientId) {
        toast.error('Client ID not found. Please log in again.');
        return;
      }
  
      // Upload file
      const uploadResult = await uploadFileToS3(fileData.file, token, clientId);
  
      // Create document record
      const documentRecord = {
        clientId,
        description: fileData.description,
        s3Url: uploadResult.s3Url,
        fileName: fileData.file.name,
        fileType: fileData.file.type,
        fileSizeBytes: fileData.file.size,
      };
  
      const recordResponse = await createDocumentRecord(documentRecord, token);
  
      toast.success('Document processed successfully!');
  
      // Pass the new document back
      if (onSuccess) onSuccess(recordResponse); // Make sure this returns the full doc object
      setOpen(false);
    } catch (error) {
      console.error('Upload process failed:', error);
      let errorMessage = 'Upload failed';
      if (error.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Check your network connection.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Server timeout. Please try again later.';
      } else {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <FaUpload className="mr-2" />
          Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Upload New Document</DialogTitle>
        </DialogHeader>
        <DocumentForm onSubmit={handleSubmit} clientId={user?.clientId} />
      </DialogContent>
    </Dialog>
  );
}