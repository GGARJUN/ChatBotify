


'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const SUPPORTED_FILE_TYPES = [
  'application/pdf',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function DocumentForm({ onSubmit, clientId }) {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFileError('');

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!SUPPORTED_FILE_TYPES.includes(selectedFile.type)) {
      setFileError('Only PDF, TXT, and DOCX files are supported');
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFileError('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setFileError('Please select a file');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        file,
        description,
        clientId
      }, setLoading);
      // Reset form on success
      setFile(null);
      setDescription('');
      e.target.reset();
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="col-span-3"
          placeholder="Document description (optional)"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="file" className="text-right">
          Document
        </Label>
        <div className="col-span-3">
          <Input
            id="file"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.txt,.docx"
            required
            className="cursor-pointer"
          />
          <div className="mt-1 text-xs text-muted-foreground">
            PDF, TXT, or DOCX (max 5MB)
          </div>
          {fileError && (
            <div className="mt-1 text-xs text-red-500">{fileError}</div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Document'}
        </Button>
      </div>
    </form>
  );
}