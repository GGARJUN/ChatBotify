// import { createContext, useState, useContext, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { signIn, signUp } from '@/lib/api/auth';
// import { jwtDecode } from 'jwt-decode';
// import { toast } from 'sonner';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   // Initialize user from localStorage
//   useEffect(() => {
//     const initializeAuth = () => {
//       const storedUser = localStorage.getItem('user');
//       if (storedUser) {
//         try {
//           setUser(JSON.parse(storedUser));
//         } catch {
//           localStorage.removeItem('user');
//         }
//       }
//       setLoading(false);
//     };
//     initializeAuth();
//   }, []);

//   // Login function
//   const login = async (credentials) => {
//     try {
//       const response = await signIn(credentials);
//       const idToken = response.idToken;
//       const decodedUser = jwtDecode(idToken);

//       const userData = {
//         userId: decodedUser["custom:userId"] || decodedUser.sub,
//         email: decodedUser.email || "",
//         name: decodedUser.name || "",
//         clientId: decodedUser["custom:clientId"] || null,
//       };

//       localStorage.setItem('user', JSON.stringify(userData));
//       localStorage.setItem('idToken', response.idToken);
//       localStorage.setItem('accessToken', response.accessToken);
//       localStorage.setItem('refreshToken', response.refreshToken);
//       setUser(userData);
//       toast.success('You have been logged in successfully');
//       router.push('/dashboard');
//     } catch (error) {
//       console.error("Login error:", error);
//       let errorMessage = 'Unable to log in. Please try again later.';
//       if (error.message.includes('NotAuthorizedException')) {
//         errorMessage = 'Incorrect email or password';
//       } else if (error.message.includes('UserNotFoundException')) {
//         errorMessage = 'User does not exist';
//       } else if (error.message.includes('UserNotConfirmedException')) {
//         errorMessage = 'Please confirm your account before logging in';
//       }
//       toast.error(errorMessage);
//       throw new Error(errorMessage);
//     }
//   };

//   // Register function
//   const register = async (userData) => {
//     try {
//       const response = await signUp(userData);
//       if (!response) throw new Error("Registration failed");

//       const newUser = {
//         email: response.emailId,
//         firstName: response.firstName,
//         lastName: response.lastName,
//         clientId: response.clientId
//       };

//       localStorage.setItem('user', JSON.stringify(newUser));
//       localStorage.setItem('idToken', response.idToken);
//       localStorage.setItem('accessToken', response.accessToken);
//       localStorage.setItem('refreshToken', response.refreshToken);

//       setUser(newUser);
//       toast.success('Registration successful!');
//       router.push('/dashboard');
//     } catch (error) {
//       console.error("Registration error:", error);
//       let errorMessage = 'Registration failed. Please try again.';
//       if (error.message.includes('UsernameExistsException')) {
//         errorMessage = 'An account with this email already exists.';
//       }
//       toast.error(errorMessage);
//       throw new Error(errorMessage);
//     }
//   };

//   // Logout function
//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//     localStorage.removeItem('idToken');
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     router.push('/auth/login');
//     // toast.info('You have been logged out.');
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


// context/AuthContext.jsx

// "use client";

// import { createContext, useState, useContext, useEffect, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { toast } from 'sonner';
// import { jwtDecode } from 'jwt-decode';
// import { signIn, signUp } from '@/lib/api/auth';

// const AuthContext = createContext(undefined);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   const initializeAuth = useCallback(() => {
//     try {
//       const storedUser = localStorage.getItem('user');
//       if (storedUser) {
//         const parsedUser = JSON.parse(storedUser) ;
//         setUser(parsedUser);
//       }
//     } catch (err) {
//       console.error("Failed to initialize auth", err);
//       localStorage.removeItem('user');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     initializeAuth();
//   }, [initializeAuth]);

//   const login = async (credentials) => {
//     try {
//       const response = await signIn(credentials);
//       const idToken = response.idToken;
//       const decodedUser = jwtDecode(idToken) ;

//       const userData = {
//         userId: decodedUser["custom:userId"] || decodedUser.sub,
//         email: decodedUser.email || "",
//         name: decodedUser.name || "",
//         clientId: decodedUser["custom:clientId"] || null,
//       };

//       // Clear existing session if clientId changes
//       const prevUser = JSON.parse(localStorage.getItem('user') || 'null');
//       if (prevUser && prevUser.clientId !== userData.clientId) {
//         localStorage.clear();
//       }


//       localStorage.setItem('idToken', idToken);


//       setUser(userData);
//       toast.success('Login successful');
//       router.push('/dashboard');
//     } catch (error) {
//       console.error("Login error:", error);
//       let errorMessage = 'Login failed. Please try again.';
      
//       if (error.message.includes('NotAuthorizedException')) {
//         errorMessage = 'Incorrect email or password';
//       } else if (error.message.includes('UserNotFoundException')) {
//         errorMessage = 'User not found';
//       } else if (error.message.includes('UserNotConfirmedException')) {
//         errorMessage = 'Please verify your email first';
//       } else if (error.message.includes('Network error')) {
//         errorMessage = 'Network error. Please check your connection.';
//       }

//       toast.error(errorMessage);
//       throw error;
//     }
//   };

//   const register = async (userData) => {
//     try {
//       const response = await signUp(userData);
//       if (!response) throw new Error("Registration failed");

//       const newUser = {
//         email: response.emailId,
//         name: `${userData.firstName} ${userData.lastName}`,
//         userId: response.userId,
//         clientId: response.clientId,
//       };

//       localStorage.setItem('user', JSON.stringify(newUser));
//       setUser(newUser);
//       toast.success('Registration successful! Please check your email to verify your account.');
//       router.push('/verify-email');
//     } catch (error) {
//       console.error("Registration error:", error);
//       let errorMessage = 'Registration failed. Please try again.';
      
//       if (error.message.includes('UsernameExistsException')) {
//         errorMessage = 'Email already in use';
//       } else if (error.message.includes('Network error')) {
//         errorMessage = 'Network error. Please check your connection.';
//       }

//       toast.error(errorMessage);
//       throw error;
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.clear();
//     toast.info('You have been logged out');
//     router.push('/login');
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, register, logout }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };





"use client";

import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/api/auth';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize user from localStorage
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

  // Login function
  const login = async (credentials) => {
    try {
      const response = await signIn(credentials);
      const idToken = response.idToken;
      const decodedUser = jwtDecode(idToken);

      const userData = {
        userId: decodedUser["custom:userId"] || decodedUser.sub,
        email: decodedUser.email || "",
        name: decodedUser.name || "",
        clientId: decodedUser["custom:clientId"] || null,
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('idToken', response.idToken);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      setUser(userData);
      toast.success('You have been logged in successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = 'Unable to log in. Please try again later.';
      if (error.message.includes('NotAuthorizedException')) {
        errorMessage = 'Incorrect email or password';
      } else if (error.message.includes('UserNotFoundException')) {
        errorMessage = 'User does not exist';
      } else if (error.message.includes('UserNotConfirmedException')) {
        errorMessage = 'Please confirm your account before logging in';
      }
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await signUp(userData);
      if (!response) throw new Error("Registration failed");

      const newUser = {
        email: response.emailId,
        firstName: response.firstName,
        lastName: response.lastName,
        clientId: response.clientId
      };

      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('idToken', response.idToken);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      setUser(newUser);
      toast.success('Registration successful!');
      router.push('/dashboard');
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = 'Registration failed. Please try again.';
      if (error.message.includes('UsernameExistsException')) {
        errorMessage = 'An account with this email already exists.';
      }
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('idToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/auth/login');
    // toast.info('You have been logged out.');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);