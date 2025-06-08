
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import DocumentForm from './DocumentForm';
import { toast } from 'sonner';
import { FaUpload } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { uploadFileToS3, createDocumentRecord } from '@/lib/api/documents';
import { useState } from 'react';

export default function DocumentUploadDialog({ onSuccess }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const handleSubmit = async (formData, setLoading) => {
    try {
      const token = localStorage.getItem('idToken');
      if (!user?.clientId) {
        toast.error('Client ID not found');
        return;
      }

      // Create optimistic document
      const optimisticDoc = {
        id: `temp-${Date.now()}`,
        fileName: formData.file.name,
        fileType: formData.file.type,
        fileSizeBytes: formData.file.size,
        description: formData.description,
        clientId: user.clientId,
        isUploading: true
      };
      onSuccess(optimisticDoc);

      // Upload to S3
      const uploadResult = await uploadFileToS3(formData.file, token, user.clientId);

      // Create database record
      const documentRecord = {
        clientId: user.clientId,
        description: formData.description,
        s3Url: uploadResult.s3Url,
        fileName: formData.file.name,
        fileType: formData.file.type,
        fileSizeBytes: formData.file.size,
      };

      const recordResponse = await createDocumentRecord(documentRecord, token);

      // Update with real document
      onSuccess({
        id: optimisticDoc.id, // Keep the same ID to allow replacement
        fileName: formData.file.name,
        fileType: formData.file.type,
        fileSizeBytes: formData.file.size,
        description: formData.description,
        clientId: user.clientId,
        s3Url: uploadResult.s3Url,
        isUploading: false,
        recordId: recordResponse.id // Include the real ID from the server
      });

      setOpen(false);
    } catch (error) {
      toast.error(error.message || 'Upload failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <FaUpload />
          Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload New Document</DialogTitle>
        </DialogHeader>
        <DocumentForm 
          onSubmit={handleSubmit} 
          clientId={user?.clientId} 
        />
      </DialogContent>
    </Dialog>
  );
}