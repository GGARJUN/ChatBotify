

// 'use client';

// import { createContext, useState, useContext, useEffect } from 'react';
// import { useRouter } from 'next/navigation';

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
//           setUser(JSON.parse(storedUser));
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
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          // First check if it's a valid JSON string
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch (e) {
            // If not JSON, it might be the old token format - clear it
            console.warn('Invalid user data in localStorage, clearing...');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await signIn(credentials);
      if (response) {
        const userData = {
          email: response.emailId,
          tokens: {
            idToken: response.idToken,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken
          }
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('idToken', response.idToken);
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        router.push('/dashboard');
        return userData;
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await signUp(userData);
      if (response) {
        const newUser = {
          email: response.emailId,
          firstName: response.firstName,
          lastName: response.lastName
        };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        return newUser;
      }
      throw new Error("Registration failed");
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
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);