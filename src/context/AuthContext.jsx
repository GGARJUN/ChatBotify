// context/AuthContext.jsx
"use client";

import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await signIn(credentials);
      const idToken = response.idToken;
      const decodedUser = jwtDecode(idToken);

      const userData = {
        userId: decodedUser["custom:userId"] || decodedUser.sub,
        email: decodedUser.email || "",
        firstName: decodedUser.given_name || "",
        lastName: decodedUser.family_name || ""
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('idToken', response.idToken);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      setUser(userData);
      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('idToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// 'use client';

// import { createContext, useState, useContext, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { signIn, signUp } from '@/lib/api/auth';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const initializeAuth = async () => {
//       try {
//         const storedUser = localStorage.getItem('user');
        
        
//         if (storedUser) {
//           // First check if it's a valid JSON string
//           try {
//             const parsedUser = JSON.parse(storedUser);
//             setUser(parsedUser);
//           } catch (e) {
//             // If not JSON, it might be the old token format - clear it
//             console.warn('Invalid user data in localStorage, clearing...');
//             localStorage.removeItem('user');
//           }
//         }
//       } catch (error) {
//         console.error('Failed to initialize auth:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     initializeAuth();
//   }, []);

//   const login = async (credentials) => {
//     try {
//       const response = await signIn(credentials);
//       if (response) {
//         const userData = {
//           email: response.emailId,
//           tokens: {
//             idToken: response.idToken,
//             accessToken: response.accessToken,
//             refreshToken: response.refreshToken
//           }
//         };
//         setUser(userData);
//         localStorage.setItem('user', JSON.stringify(userData));
//         localStorage.setItem('idToken', response.idToken);
//         localStorage.setItem('accessToken', response.accessToken);
//         localStorage.setItem('refreshToken', response.refreshToken);
//         console.log("userData",userData);
//         router.push('/dashboard');
//         return userData;
//       }
//       throw new Error("Invalid response from server");
//     } catch (error) {
//       throw error;
//     }
//   };

//   const register = async (userData) => {
//     try {
//       const response = await signUp(userData);
//       if (response) {
//         const newUser = {
//           email: response.emailId,
//           firstName: response.firstName,
//           lastName: response.lastName
//         };
//         setUser(newUser);
//         localStorage.setItem('user', JSON.stringify(newUser));
//         return newUser;
//       }
//       throw new Error("Registration failed");
//     } catch (error) {
//       throw error;
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//     localStorage.removeItem('idToken');
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     router.push('/auth/login');
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


// 'use client';

// import { createContext, useState, useContext, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { signIn, signUp } from '@/lib/api/auth';
// import * as jwtDecode from 'jwt-decode';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   // Helper function to decode JWT and extract user info
//   const decodeUserFromToken = (idToken) => {
//     try {
//       // Use jwtDecode directly
//       const decoded = jwtDecode(idToken);
//       console.log('Decoded JWT:', decoded);

//       return {
//         userId: decoded['custom:userId'] || decoded.sub,
//         email: decoded.email || '',
//         firstName: decoded.given_name || '',
//         lastName: decoded.family_name || ''
//       };
//     } catch (error) {
//       console.error('Error decoding JWT:', error);
//       return null;
//     }
//   };

//   useEffect(() => {
//     const initializeAuth = async () => {
//       try {
//         const storedUser = localStorage.getItem('user');
//         const idToken = localStorage.getItem('idToken');

//         if (storedUser && idToken) {
//           try {
//             const parsedUser = JSON.parse(storedUser);
//             const decodedUser = decodeUserFromToken(idToken);

//             if (decodedUser) {
//               console.log('User initialized from localStorage:', decodedUser);
//               setUser({ ...parsedUser, ...decodedUser });
//             } else {
//               console.warn('Invalid token, clearing user data');
//               logout();
//             }
//           } catch (e) {
//             console.warn('Invalid user data in localStorage, clearing...');
//             logout();
//           }
//         }
//       } catch (error) {
//         console.error('Failed to initialize auth:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     initializeAuth();
//   }, []);

//   const login = async (credentials) => {
//     try {
//       console.log('Attempting login with credentials:', credentials.email);
//       const response = await signIn(credentials);

//       if (response) {
//         console.log('Login response:', response);
//         const decodedUser = decodeUserFromToken(response.idToken);

//         if (!decodedUser) {
//           throw new Error("Failed to decode user information");
//         }

//         const userData = {
//           ...decodedUser,
//           email: response.emailId || decodedUser.email,
//           tokens: {
//             idToken: response.idToken,
//             accessToken: response.accessToken,
//             refreshToken: response.refreshToken
//           }
//         };

//         console.log('User data after login:', userData);
//         setUser(userData);
//         localStorage.setItem('user', JSON.stringify(userData));
//         localStorage.setItem('idToken', response.idToken);
//         localStorage.setItem('accessToken', response.accessToken);
//         localStorage.setItem('refreshToken', response.refreshToken);

//         router.push('/dashboard');
//         return userData;
//       }
//       throw new Error("Invalid response from server");
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   };

//   const register = async (userData) => {
//     try {
//       console.log('Attempting registration with data:', userData);
//       const response = await signUp(userData);

//       if (response) {
//         console.log('Registration response:', response);
//         const newUser = {
//           email: response.emailId,
//           firstName: userData.firstName,
//           lastName: userData.lastName
//         };

//         setUser(newUser);
//         localStorage.setItem('user', JSON.stringify(newUser));
//         console.log('User after registration:', newUser);

//         return newUser;
//       }
//       throw new Error("Registration failed");
//     } catch (error) {
//       console.error('Registration error:', error);
//       throw error;
//     }
//   };

//   const logout = () => {
//     console.log('Logging out user');
//     setUser(null);
//     localStorage.removeItem('user');
//     localStorage.removeItem('idToken');
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     router.push('/auth/login');
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);