'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';

const SUPPORTED_FILE_TYPES = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function DocumentForm({ onSubmit, botId: initialBotId }) {
  const [file, setFile] = useState(null);
  const [botId, setBotId] = useState(initialBotId || '');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState('');

  const { user } = useAuth();
  const clientId = user?.clientId || '';

  useEffect(() => {
    if (initialBotId) {
      setBotId(initialBotId);
    }
  }, [initialBotId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'botId') setBotId(value);
    if (name === 'description') setDescription(value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFileError('');

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Validate file type
    if (!SUPPORTED_FILE_TYPES.includes(selectedFile.type)) {
      setFileError('Unsupported file type. Please upload PDF, TXT, or DOCX.');
      setFile(null);
      return;
    }

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setFileError('File size exceeds 5MB limit');
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!file) {
      setFileError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('fileIn', file);
    if (botId) formData.append('botId', botId);
    if (description) formData.append('description', description);
    if (clientId) formData.append('clientId', clientId);

    onSubmit(formData, setLoading);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="clientId" className="text-right">Client ID</Label>
        <Input
          id="clientId"
          name="clientId"
          value={clientId}
          readOnly
          disabled
          className="col-span-3 bg-gray-100 cursor-not-allowed"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="botId" className="text-right">Bot ID</Label>
        <Input
          id="botId"
          name="botId"
          value={botId}
          onChange={handleChange}
          className="col-span-3"
          placeholder="Leave empty for general documents"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={handleChange}
          className="col-span-3"
          placeholder="Document purpose or summary"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fileIn" className="text-right">Document</Label>
        <div className="col-span-3">
          <Input
            id="fileIn"
            name="fileIn"
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
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? (
            <>
              <span className="mr-2">Uploading...</span>
            </>
          ) : (
            'Upload Document'
          )}
        </Button>
      </div>
    </form>
  );
}