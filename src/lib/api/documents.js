import axios from 'axios';
import { toast } from 'sonner';

// const API_BASE_URL = 'https://p12k32pylk.execute-api.us-east-1.amazonaws.com/dev'; 

// const API_BASE = 'https://080mcx9lu3.execute-api.us-east-1.amazonaws.com/dev';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const FILE_UPLOAD_URL = process.env.NEXT_PUBLIC_FILE_UPLOAD_URL;

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
  const url = `${FILE_UPLOAD_URL}/${clientId}/${filename}`;

  try {
    console.log('Uploading to:', url);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': FILE_TYPE_HEADERS[file.type],
        
      },
      body: file,
      // signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to upload file: ${errorText || response.statusText}`);
    }

    console.log('Upload successful',response);
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
    const response = await fetch(`${API_BASE_URL}/rc/docs/md`, {
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



export const downloadDocument = async (s3Url, docId, token, preview = false) => {
  try {
    const signUrl = `${API_BASE_URL}/rc/docs/sign?s3Url=${encodeURIComponent(s3Url)}`;
    console.log('Fetching presigned URL from:', signUrl);

    const presignedResponse = await fetch(signUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!presignedResponse.ok) {
      const errorText = await presignedResponse.text();
      throw new Error(`Failed to fetch presigned URL: ${errorText || presignedResponse.statusText}`);
    }

    const presignedUrl = await presignedResponse.text();
    if (!presignedUrl) {
      throw new Error('No presigned URL received');
    }

    console.log('Presigned URL received:', presignedUrl);

    const response = await fetch(presignedUrl, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to download document: ${errorText || response.statusText}`);
    }

    let filename = `document-${docId}`;
    const disposition = response.headers.get('content-disposition');
    if (disposition && disposition.includes('filename=')) {
      const matches = /filename="?([^"]+)"?/.exec(disposition);
      if (matches && matches[1]) {
        filename = matches[1];
      }
    } else {
      const urlParts = s3Url.split('/');
      filename = decodeURIComponent(urlParts[urlParts.length - 1]);
    }

    if (preview) {
      const arrayBuffer = await response.arrayBuffer();
      return { data: arrayBuffer, filename };
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Error downloading document:', {
      docId,
      s3Url,
      message: error.message,
    });
    throw new Error(error.message || 'Failed to download document');
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


export const deleteDocument = async (docId, token) => {
  try {
    const url = `${API_BASE_RC}/rc/docs/${docId}`;
    console.log('Deleting document at:', url);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        errorText = errorJson.message || errorText;
      } catch (e) {
        // Non-JSON response, use raw text
      }
      throw new Error(`Failed to delete document: ${errorText || response.statusText}`);
    }

    let result = { message: 'Document deleted successfully' };
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        result = await response.json();
      } catch (jsonError) {
        console.warn('Failed to parse JSON response:', jsonError);
      }
    }

    console.log('Delete successful:', result);
    return result;
  } catch (error) {
    console.error('Error deleting document:', {
      docId,
      message: error.message,
    });
    throw new Error(error.message || 'Failed to delete document');
  }
};