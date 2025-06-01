// 'use client';

// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';

// const SUPPORTED_FILE_TYPES = {
//   PDF: 'application/pdf',
//   TXT: 'text/plain',
//   DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
// };
// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// export default function DocumentForm({ onSubmit, clientId }) {
//   const [file, setFile] = useState(null);
//   const [description, setDescription] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [fileError, setFileError] = useState('');

//   const handleDescriptionChange = (e) => {
//     setDescription(e.target.value);
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     setFileError('');

//     if (!selectedFile) {
//       setFile(null);
//       return;
//     }

//     // Validate file type
//     if (!Object.values(SUPPORTED_FILE_TYPES).includes(selectedFile.type)) {
//       setFileError('Unsupported file type. Please upload PDF, TXT, or DOCX.');
//       setFile(null);
//       return;
//     }

//     // Validate file size
//     if (selectedFile.size > MAX_FILE_SIZE) {
//       setFileError('File size exceeds 5MB limit');
//       setFile(null);
//       return;
//     }

//     // Add description to file object
//     selectedFile.description = description;
//     setFile(selectedFile);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       setFileError('Please select a file to upload');
//       return;
//     }

//     setLoading(true);
//     try {
//       await onSubmit(file, () => setLoading(false));
//       // Reset form on success
//       setFile(null);
//       setDescription('');
//       e.target.reset();
//     } catch (error) {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="grid grid-cols-4 items-center gap-4">
//         <Label htmlFor="clientId" className="text-right">Client ID</Label>
//         <Input
//           id="clientId"
//           value={clientId || ''}
//           readOnly
//           disabled
//           className="col-span-3 bg-gray-100 cursor-not-allowed"
//         />
//       </div>

//       <div className="grid grid-cols-4 items-center gap-4">
//         <Label htmlFor="description" className="text-right">Description</Label>
//         <Textarea
//           id="description"
//           value={description}
//           onChange={handleDescriptionChange}
//           className="col-span-3"
//           placeholder="Document purpose or summary"
//           rows={3}
//         />
//       </div>

//       <div className="grid grid-cols-4 items-center gap-4">
//         <Label htmlFor="fileIn" className="text-right">Document</Label>
//         <div className="col-span-3">
//           <Input
//             id="fileIn"
//             type="file"
//             onChange={handleFileChange}
//             accept=".pdf,.txt,.docx"
//             required
//             className="cursor-pointer"
//           />
//           <div className="mt-1 text-xs text-muted-foreground">
//             PDF, TXT, or DOCX (max 5MB)
//           </div>
//           {fileError && (
//             <div className="mt-1 text-xs text-red-500">{fileError}</div>
//           )}
//         </div>
//       </div>

//       <div className="flex justify-end pt-4">
//         <Button type="submit" disabled={loading} className="w-full sm:w-auto">
//           {loading ? 'Uploading...' : 'Upload Document'}
//         </Button>
//       </div>
//     </form>
//   );
// }



'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const SUPPORTED_FILE_TYPES = {
  PDF: 'application/pdf',
  TXT: 'text/plain',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function DocumentForm({ onSubmit, clientId }) {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState('');

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFileError('');

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Validate file type
    if (!Object.values(SUPPORTED_FILE_TYPES).includes(selectedFile.type)) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setFileError('Please select a file to upload');
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
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="clientId" className="text-right">Client ID</Label>
        <Input
          id="clientId"
          value={clientId || ''}
          readOnly
          disabled
          className="col-span-3 bg-gray-100 cursor-not-allowed"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={handleDescriptionChange}
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
          {loading ? 'Uploading...' : 'Upload Document'}
        </Button>
      </div>
    </form>
  );
}