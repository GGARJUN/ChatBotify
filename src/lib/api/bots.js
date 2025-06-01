import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = 'https://p12k32pylk.execute-api.us-east-1.amazonaws.com/dev';

export const createBot = async (botData, token) => {
  try {
    // Validate required fields
    if (!botData.clientId || !botData.name || !botData.status) {
      throw new Error('Missing required fields: clientId, name, status');
    }

    const response = await axios.post(`${API_BASE_URL}/rc/bots/`, botData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error creating bot:', error.response?.data || error.message);
    const message =
      error.response?.data?.message ||
      error.message ||
      'Failed to create bot';
    throw new Error(message);
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