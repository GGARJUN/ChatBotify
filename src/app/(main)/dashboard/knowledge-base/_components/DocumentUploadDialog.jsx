// // 'use client';

// // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// // import { useRouter } from 'next/navigation';
// // import DocumentForm from './DocumentForm';
// // import { toast } from 'sonner';
// // import { FaUpload } from 'react-icons/fa6';
// // import { Button } from '@/components/ui/button';
// // import { useAuth } from '@/context/AuthContext';
// // import { uploadBinaryDocument } from '@/lib/api/documents';

// // export default function DocumentUploadDialog({ onSuccess }) {
// //   const router = useRouter();
// //   const { user } = useAuth();

// //   const handleSubmit = async (file, setLoading) => {
// //     try {
// //       const token = localStorage.getItem('idToken');
// //       const clientId = localStorage.getItem('clientId') || user?.clientId;
  
// //       if (!token) {
// //         toast.error('Session expired. Please login again.');
// //         router.push('/auth/login');
// //         return;
// //       }
  
// //       if (!clientId) {
// //         toast.error('Client ID not found. Please log in again.');
// //         return;
// //       }
  
// //       const response = await uploadBinaryDocument(file, token, clientId);
// //       toast.success('Document uploaded successfully!');
// //       if (onSuccess) onSuccess(response);
// //       return response;
// //     } catch (error) {
// //       console.error('Upload failed:', error.message);
// //       toast.error(error.message);
// //       throw error; // Re-throw to let form handle it
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <Dialog>
// //       <DialogTrigger asChild>
// //         <Button>
// //           <FaUpload className="mr-2" />
// //           Upload Document
// //         </Button>
// //       </DialogTrigger>
// //       <DialogContent className="sm:max-w-[600px]">
// //         <DialogHeader>
// //           <DialogTitle className="text-xl font-semibold">Upload New Document</DialogTitle>
// //         </DialogHeader>
// //         <DocumentForm 
// //           onSubmit={handleSubmit} 
// //           clientId={user?.clientId} 
// //         />
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }



// 'use client';

// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { useRouter } from 'next/navigation';
// import DocumentForm from './DocumentForm';
// import { toast } from 'sonner';
// import { FaUpload } from 'react-icons/fa6';
// import { Button } from '@/components/ui/button';
// import { useAuth } from '@/context/AuthContext';
// import { uploadFileToS3, createDocumentRecord } from '@/lib/api/documents';

// export default function DocumentUploadDialog({ onSuccess }) {
//   const router = useRouter();
//   const { user } = useAuth();

//   const handleSubmit = async (fileData, setLoading) => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('idToken');
//       const clientId = localStorage.getItem('clientId') || user?.clientId;
  
//       if (!token) {
//         toast.error('Session expired. Please login again.');
//         router.push('/auth/login');
//         return;
//       }
  
//       if (!clientId) {
//         toast.error('Client ID not found. Please log in again.');
//         return;
//       }

//       // Step 1: Upload file to S3
//       const uploadResult = await uploadFileToS3(fileData.file, token, clientId);
      
//       // Step 2: Create document record
//       const documentRecord = {
//         clientId,
//         filename: fileData.file.name,
//         originalFilename: fileData.file.name,
//         description: fileData.description,
//         fileType: fileData.file.type,
//         fileSize: fileData.file.size,
//         s3Url: uploadResult.s3Url,
//         status: 'active',
//         metadata: {} // Add any additional metadata here
//       };

//       const recordResponse = await createDocumentRecord(documentRecord, token);
      
//       toast.success('Document uploaded and registered successfully!');
//       if (onSuccess) onSuccess(recordResponse);
//       return recordResponse;
//     } catch (error) {
//       console.error('Upload failed:', error.message);
//       toast.error(error.message);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button>
//           <FaUpload className="mr-2" />
//           Upload Document
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[600px]">
//         <DialogHeader>
//           <DialogTitle className="text-xl font-semibold">Upload New Document</DialogTitle>
//         </DialogHeader>
//         <DocumentForm 
//           onSubmit={handleSubmit} 
//           clientId={user?.clientId} 
//         />
//       </DialogContent>
//     </Dialog>
//   );
// }




'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import DocumentForm from './DocumentForm';
import { toast } from 'sonner';
import { FaUpload } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { uploadFileToS3, createDocumentRecord } from '@/lib/api/documents';

export default function DocumentUploadDialog({ onSuccess }) {
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async (fileData, setLoading) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('idToken');
      const clientId = localStorage.getItem('clientId') || user?.clientId;
  
      if (!token) {
        toast.error('Session expired. Please login again.');
        router.push('/auth/login');
        return;
      }
  
      if (!clientId) {
        toast.error('Client ID not found. Please log in again.');
        return;
      }

      // Validate token
      if (token.length < 100) { // Simple validation
        toast.error('Invalid token format');
        return;
      }

      // Step 1: Upload file to S3
      toast.info('Uploading file to storage...');
      const uploadResult = await uploadFileToS3(fileData.file, token, clientId);
      
      // Step 2: Create document record
      toast.info('Creating document record...');
      const documentRecord = {
        clientId,
        filename: fileData.file.name,
        originalFilename: fileData.file.name,
        description: fileData.description,
        fileType: fileData.file.type,
        fileSize: fileData.file.size,
        s3Url: uploadResult.s3Url,
        status: 'active',
        metadata: {
          uploadedAt: new Date().toISOString(),
          uploadedBy: user?.email || 'unknown'
        }
      };

      const recordResponse = await createDocumentRecord(documentRecord, token);
      
      toast.success('Document processed successfully!');
      if (onSuccess) onSuccess(recordResponse);
      return recordResponse;
    } catch (error) {
      console.error('Upload process failed:', error);
      
      // More specific error messages
      if (error.message.includes('Network Error')) {
        toast.error('Cannot connect to server. Check your network connection.');
      } else if (error.message.includes('timeout')) {
        toast.error('Server timeout. Please try again later.');
      } else {
        toast.error(`Upload failed: ${error.message}`);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
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
        <DocumentForm 
          onSubmit={handleSubmit} 
          clientId={user?.clientId} 
        />
      </DialogContent>
    </Dialog>
  );
}