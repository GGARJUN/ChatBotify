import axios from 'axios';

const API_URL = 'https://p12k32pylk.execute-api.us-east-1.amazonaws.com/dev/rc/users'; 

export const getUserProfile = async (userId, token) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, updatedData, token) => {
  try {
    const response = await axios.patch(`${API_URL}/${userId}`, updatedData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};