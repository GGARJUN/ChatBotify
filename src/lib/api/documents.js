import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = 'https://p12k32pylk.execute-api.us-east-1.amazonaws.com/dev'; 

// Upload document with botId, clientId, description, etc.
// export const uploadDocument = async (formData, token) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/rc/docs/upload`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     console.log('Document uploaded successfully:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error uploading document:', {
//       status: error.response?.status,
//       data: error.response?.data,
//       message: error.message,
//     });

//     const errorMessage =
//       error.response?.data?.message ||
//       error.message ||
//       'Failed to upload document';

//     toast.error(errorMessage);
//     throw new Error(errorMessage);
//   }
// };


const API_BASE = 'https://080mcx9lu3.execute-api.us-east-1.amazonaws.com/dev';

export const uploadFileToS3 = async (file, token, clientId) => {
  if (!file || !clientId) {
    throw new Error('Missing required fields: file or clientId');
  }

  // Debug log
  console.log('Preparing to upload file:', {
    name: file.name,
    type: file.type,
    size: file.size
  });

  const filename = encodeURIComponent(file.name);
  const url = `${API_BASE}/${clientId}/${filename}`;

  try {
    console.log('Uploading to:', url);
    
    const response = await axios.put(url, file, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': file.type,
        'x-amz-meta-originalname': file.name, // Add original filename as metadata
      },
      timeout: 30000, // 30 second timeout
    });

    console.log('Upload response:', response);
    return {
      success: true,
      filename: filename,
      s3Url: url,
      fileType: file.type,
      size: file.size
    };
  } catch (error) {
    console.error('Upload error details:', {
      config: error.config,
      response: error.response,
      message: error.message
    });

    let errorMessage = 'Failed to upload file';
    if (error.response) {
      errorMessage = error.response.data?.message || 
                    JSON.stringify(error.response.data);
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout - server took too long to respond';
    } else if (error.message === 'Network Error') {
      errorMessage = 'Network error - check your connection or CORS settings';
    } else {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};

export const createDocumentRecord = async (documentData, token) => {
  if (!documentData || !token) {
    throw new Error('Missing required fields: documentData or token');
  }

  const url = `${API_BASE_URL}/rc/docs/download`;
  
  try {
    console.log('Creating document record:', documentData);
    const response = await axios.post(url, documentData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    return response.data;
  } catch (error) {
    console.error('Document record creation error:', error);
    throw new Error(error.response?.data?.message || 'Failed to create document record');
  }
};




// Fetch all documents
export const getDocuments = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rc/docs/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Fetched documents:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch documents';

    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export const getSingleDocument = async (botId, token ) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/rc/docs/${botId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching bot details:', error.response?.data || error.message);
    const message =
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch bot details';

    toast.error(message);
    throw new Error(message);
  }
};

// Download document
// export const downloadDocument = async (docId, token) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/rc/docs/${docId}/download`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       responseType: 'blob', // Important for file downloads
//     });

//     // Extract filename from Content-Disposition header
//     const disposition = response.headers['content-disposition'];
//     let filename = 'document';
//     if (disposition && disposition.indexOf('filename=') !== -1) {
//       const matches = /filename="?([^"]+)"?/.exec(disposition);
//       if (matches.length > 1) {
//         filename = matches[1];
//       }
//     }

//     // Create a link element and trigger download
//     const blob = new Blob([response.data]);
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', filename);
//     document.body.appendChild(link);
//     link.click();
//     link.remove();

//     return true; // success
//   } catch (error) {
//     console.error('Error downloading document:', error);
//     throw new Error('Failed to download document');
//   }
// };

export const downloadDocument = async (docId, token, preview = false) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rc/docs/${docId}/download`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: preview ? 'arraybuffer' : 'blob',
    });

    if (preview) {
      // Return raw data for preview
      return response.data;
    }

    // Trigger download
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Extract filename from Content-Disposition header
    const disposition = response.headers['content-disposition'];
    let filename = 'document';
    if (disposition && disposition.indexOf('filename=') !== -1) {
      const matches = /filename="?([^"]+)"?/.exec(disposition);
      if (matches.length > 1) {
        filename = matches[1];
      }
    }

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();

    return true; // success
  } catch (error) {
    console.error('Error fetching document:', error);
    throw new Error('Failed to fetch document');
  }
};


// const linkDocumentToBot = async (

// ) => {
//   const url = 'https://p12k32pylk.execute-api.us-east-1.amazonaws.com/dev/rc/document-access'; 

//   const body = JSON.stringify({
//     botId,
//     documentId,
//     clientId,
//   });

//   const response = await fetch(url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//     },
//     body,
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || 'Failed to link document');
//   }

//   return await response.json();
// };

// const unlinkDocumentFromBot = async (

// ) => {
//   const url = 'https://p12k32pylk.execute-api.us-east-1.amazonaws.com/dev/rc/document-access'; 

//   const body = JSON.stringify({
//     botId,
//     documentId,
//     clientId,
//   });

//   const response = await fetch(url, {
//     method: 'DELETE', // Assuming DELETE is supported
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//     },
//     body,
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || 'Failed to unlink document');
//   }

//   return await response.json();
// };