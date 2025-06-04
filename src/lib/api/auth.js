
const API_BASE_URL =  'https://p12k32pylk.execute-api.us-east-1.amazonaws.com/dev';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || 
      (response.status === 401 ? 'Invalid credentials' : 
       response.status === 403 ? 'Access denied' : 
       response.status === 429 ? 'Too many requests' : 
       'Request failed');
    
    const error = new Error(errorMessage);
    error.code = response.status;
    error.details = errorData;
    throw error;
  }
  return await response.json();
};

export const signIn = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signIn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailId: credentials.email,
        password: credentials.password
      }),
    });
    const data = await handleResponse(response);

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};

export const signUp = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signUp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};