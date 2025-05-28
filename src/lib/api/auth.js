// const API_BASE_URL = 'https://p12k32pylk.execute-api.us-east-1.amazonaws.com/dev';

// export const signIn = async (credentials) => {
//   const response = await fetch(`${API_BASE_URL}/auth/signIn`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       emailId: credentials.email,
//       password: credentials.password
//     }),
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || 'Login failed');
//   }

//   return await response.json();
// };

// export const signUp = async (userData) => {
//   const response = await fetch(`${API_BASE_URL}/auth/signUp`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       emailId: userData.email,
//       firstName: userData.firstName,
//       lastName: userData.lastName,
//       password: userData.password,
//       organization: userData.organization || 'personal'
//     }),
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || 'Registration failed');
//   }

//   return await response.json();
// };



const API_BASE_URL = 'https://p12k32pylk.execute-api.us-east-1.amazonaws.com/dev';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Request failed');
  }
  return await response.json();
};

export const signIn = async (credentials) => {
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
  return handleResponse(response);
};

export const signUp = async (userData) => {
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
  return handleResponse(response);
};