import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = 'https://p12k32pylk.execute-api.us-east-1.amazonaws.com/dev'; 

const API_BASE = 'https://080mcx9lu3.execute-api.us-east-1.amazonaws.com/dev';
const API_BASE_RC = 'https://p12k32pylk.execute-api.us-east-1.amazonaws.com/dev';

const FILE_TYPE_HEADERS = {
  'application/pdf': 'application/pdf',
  'text/plain': 'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png': 'image/png',
  'image/jpeg': 'image/jpeg',
  'text/csv': 'text/csv',
  'application/json': 'application/json',
  'application/zip': 'application/zip',
  'video/mp4': 'video/mp4',
};

export const uploadFileToS3 = async (file, token, clientId) => {
  if (!file || !clientId) {
    throw new Error('Missing required fields: file or clientId');
  }

  if (!FILE_TYPE_HEADERS[file.type]) {
    throw new Error(`Unsupported file type: ${file.type}`);
  }

  console.log('Preparing to upload file:', {
    name: file.name,
    type: file.type,
    size: file.size,
  });

  const filename = encodeURIComponent(file.name);
  const url = `${API_BASE}/${clientId}/${filename}`;

  try {
    console.log('Uploading to:', url);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': FILE_TYPE_HEADERS[file.type],
        'x-amz-meta-originalname': file.name,
      },
      body: file,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to upload file: ${errorText || response.statusText}`);
    }

    console.log('Upload successful');
    return {
      success: true,
      filename: filename,
      s3Url: `s3://rc-doc-store-dev/${clientId}/${filename}`,
      fileType: file.type,
      size: file.size,
    };
  } catch (error) {
    console.error('Upload error details:', {
      url,
      message: error.message,
    });

    let errorMessage = 'Failed to upload file';
    if (error.name === 'AbortError') {
      errorMessage = 'Request timed out - server took too long to respond';
    } else if (error.message.includes('Failed to fetch')) {
      errorMessage = 'Network error - check your connection or CORS settings';
    } else {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};

export const createDocumentRecord = async (documentRecord, token) => {
  try {
    const response = await fetch(`${API_BASE_RC}/rc/docs/md`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        clientId: documentRecord.clientId,
        description: documentRecord.description,
        s3Url: documentRecord.s3Url,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to create document record');
    }

    let result;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      try {
        result = await response.json();
      } catch (jsonError) {
        console.warn('Failed to parse JSON response:', jsonError);
        result = { message: 'Document record created successfully' };
      }
    } else {
      const text = await response.text();
      console.warn('Non-JSON response received:', text);
      result = { message: text || 'Document record created successfully' };
    }

    return result;
  } catch (error) {
    console.error('Error in createDocumentRecord:', error);
    throw error;
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


export const grantDocumentAccess = async (botId, documentId, clientId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rc/document-access`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        botId,
        documentId,
        clientId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to link document: ${errorText || response.statusText}`);
    }

    let result;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      try {
        result = await response.json();
      } catch (jsonError) {
        console.warn('Failed to parse JSON response:', jsonError);
        result = { message: 'Document linked successfully, but no JSON response received' };
      }
    } else {
      const text = await response.text();
      console.warn('Non-JSON response received:', text);
      result = { message: text || 'Document linked successfully' };
    }

    return result;

  } catch (error) {
    console.error('Error in grantDocumentAccess:', error);
    throw error;
  }
};

export const revokeDocumentAccess = async (accessId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rc/document-access/${accessId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = response.statusText;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.warn('Failed to parse JSON error response:', jsonError);
        }
      } else {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
      throw new Error(`Failed to revoke document access: ${errorMessage}`);
    }

    let result;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      try {
        result = await response.json();
      } catch (jsonError) {
        console.warn('Failed to parse JSON response:', jsonError);
        result = { message: 'Document access revoked successfully' };
      }
    } else {
      const text = await response.text();
      console.warn('Non-JSON response received:', text);
      result = { message: text || 'Document access revoked successfully' };
    }

    return result;

  } catch (error) {
    console.error('Error revoking document access:', {
      endpoint: `${API_BASE_URL}/rc/document-access/${accessId}`,
      error: error.message,
    });
    throw error;
  }
};