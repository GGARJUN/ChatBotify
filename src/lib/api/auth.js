const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    
    // Check for specific error messages
    if (errorText.includes('[NOT_VERIFIED]')) {
      throw new Error('User email not verified. Please check your inbox for the verification email.');
    }
    if (errorText.includes('Unauthorized')) {
      throw new Error('NotAuthorizedException');
    }
    
    throw new Error(errorText || 'Request failed');
  }
  
  return await response.json();
};

// Sign-in function
export const signIn = async (credentials) => {
  try {
    // Input validation
    if (!credentials?.email || !credentials?.password) {
      throw new Error('Email and password are required');
    }
    if (!isValidEmail(credentials.email)) {
      throw new Error('Invalid email format');
    }
    if (credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const response = await fetch(`${API_BASE_URL}/auth/signIn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailId: credentials.email,
        password: credentials.password,
      }),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('SignIn error:', error.message);
    throw error;
  }
};

// Sign-up function
export const signUp = async (userData) => {
  try {
    // Input validation
    if (!userData?.email || !userData?.firstName || !userData?.lastName || !userData?.password) {
      throw new Error('Email, first name, last name, and password are required');
    }
    if (!isValidEmail(userData.email)) {
      throw new Error('Invalid email format');
    }
    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

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
        organization: userData.organization || 'personal',
      }),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('SignUp error:', error.message);
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};