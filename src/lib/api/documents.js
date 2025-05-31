import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = 'https://p12k32pylk.execute-api.us-east-1.amazonaws.com/dev'; 

// Upload document with botId, clientId, description, etc.
export const uploadDocument = async (formData, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/rc/docs/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Document uploaded successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error uploading document:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Failed to upload document';

    toast.error(errorMessage);
    throw new Error(errorMessage);
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

export const getSingleDocument = async (botId, token, ) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/rc/docs/${botId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Fetched Bot Data:', response.data);
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