// import axios from 'axios';
// import { toast } from 'sonner';

// const API_BASE_URL = 'https://p12k32pylk.execute-api.us-east-1.amazonaws.com/dev';

// export const createBot = async (botData, token) => {
//   try {
//     // Validate required fields
//     if (!botData.clientId || !botData.name || !botData.status) {
//       throw new Error('Missing required fields: clientId, name, status');
//     }

//     const response = await axios.post(`${API_BASE_URL}/rc/bots/`, botData, {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.error('Error creating bot:', error.response?.data || error.message);
//     const message =
//       error.response?.data?.message ||
//       error.message ||
//       'Failed to create bot';
//     throw new Error(message);
//   }
// };


import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = 'https://p12k32pylk.execute-api.us-east-1.amazonaws.com/dev';

export const createBot = async (botData, token) => {
  try {
    // Validate required fields
    if (!botData.clientId || !botData.name || !botData.status) {
      throw new Error('Missing required fields: clientId, name, status');
    }

    // Validate token
    if (!token) {
      throw new Error('Authentication token is missing');
    }

    // Log the request data for debugging (excluding sensitive token)
    console.log('Creating bot with data:', { ...botData });

    const response = await axios.post(`${API_BASE_URL}/rc/bots/`, botData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      timeout: 10000, // Set a timeout of 10 seconds
    });

    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    // Enhanced error handling
    let message = 'Failed to create bot';
    
    if (error.response) {
      // Server responded with a status code outside 2xx
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });

      if (error.response.status === 401) {
        message = 'Unauthorized: Invalid or expired token. Please log in again.';
      } else if (error.response.status === 403) {
        message = 'Forbidden: You do not have permission to perform this action.';
      } else if (error.response.status >= 500) {
        message = 'Server error: Please try again later.';
      } else {
        message = error.response.data?.message || message;
      }
    } else if (error.request) {
      // No response received (network error)
      console.error('Network Error:', error.request);
      message = 'Network error: Unable to reach the server. Please check your connection.';
    } else {
      // Other errors (e.g., request setup issues)
      console.error('Error:', error.message);
      message = error.message;
    }

    throw new Error(message);
  }
};

export const getBotswithoutdocs = async (token, clientId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rc/bots/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      params: { clientId }, // important!
    });

    return response.data || [];
  } catch (error) {
    console.error('Error fetching bots:', error.message);
    throw new Error(error.message || 'Failed to fetch bots');
  }
};

export const getBots = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rc/bots/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching bots:', error.response?.data || error.message);
    const message =
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch bots';
    throw new Error(message);
  }
};




export const getSingleBot = async (botId, token, includeDocs = true) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/rc/bots/${botId}/detail?includeDocs=${includeDocs}`,
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

export const updateBot = async (botId, updateData, token) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/rc/bots/${botId}`,
      updateData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success('Bot updated successfully!');
    return response.data;
  } catch (error) {
    console.error('Error updating bot:', error.response?.data || error.message);
    const message =
      error.response?.data?.message ||
      error.message ||
      'Failed to update bot';

    toast.error(message);
    throw new Error(message);
  }
};