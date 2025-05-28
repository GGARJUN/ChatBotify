import axios from 'axios';

const API_BASE_URL = 'https://p12k32pylk.execute-api.us-east-1.amazonaws.com/dev';

export const createBot = async (botData, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/rc/bots/`, botData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating bot:', error);
    throw new Error(error.response?.data?.message || 'Failed to create bot');
  }
};

export const getBots = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rc/bots/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching bots:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch bots');
  }
};