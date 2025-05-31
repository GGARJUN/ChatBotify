'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import DocumentForm from './DocumentForm';
import { uploadDocument } from '@/lib/api/documents';
import { toast } from 'sonner';

export default function DocumentUploadDialog({ open, onOpenChange, botId = null }) {
  const router = useRouter();

  const handleSubmit = async (formData, setLoading) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('idToken');
      if (!token) {
        toast.error('Session expired. Please login again.');
        router.push('/auth/login');
        return null;
      }

      const response = await uploadDocument(formData, token);
      toast.success('Document uploaded successfully!');
      onOpenChange(false);
      return response;
    } catch (error) {
      console.error('Upload failed:', error.message);
      // Error toast is already shown by the API service
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Upload New Document</DialogTitle>
        </DialogHeader>
        <DocumentForm onSubmit={handleSubmit} botId={botId} />
      </DialogContent>
    </Dialog>
  );
}