const API_BASE_URL = 'https://p12k32pylk.execute-api.us-east-1.amazonaws.com/dev';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || 
      (response.status === 401 ? 'Invalid credentials' : 'Request failed');
    throw new Error(errorMessage);
  }
  return await response.json();
};

export const signIn = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signIn`, {
      method: 'POST',
      mode: 'cors', // Explicitly set CORS mode
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        emailId: credentials.email,
        password: credentials.password
      }),
    });
    return await handleResponse(response);
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};

export const signUp = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signUp`, {
      method: 'POST',
      mode: 'cors', // Explicitly set CORS mode
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        emailId: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: userData.password,
        organization: userData.organization || 'personal'
      }),
    });
    return await handleResponse(response);
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};