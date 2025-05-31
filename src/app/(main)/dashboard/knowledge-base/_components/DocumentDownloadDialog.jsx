// app/knowledge-base/_components/DocumentViewDialog.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FiX } from 'react-icons/fi';
import { toast } from 'sonner';

export default function DocumentViewDialog({ document, open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>View Document</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <p className="text-sm text-gray-700">
            View details for <strong>{document.fileName}</strong>.
          </p>

          <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-sm">
            <p className="text-gray-600 truncate">{document.fileName}</p>
            <p className="text-gray-500 mt-1">{document.fileTypeLabel} - {document.fileSizeLabel}</p>
            <p className="text-gray-500 mt-1">Created: {new Date(document.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}</p>
            {document.description && (
              <p className="text-gray-700 mt-2 line-clamp-2">
                Description: {document.description}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <FiX className="mr-2" /> Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}