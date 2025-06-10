


'use client';

import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/api/auth';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const router = useRouter();

  // Initialize auth state from localStorage
  const initializeAuth = useCallback(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const idToken = localStorage.getItem('idToken');
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (storedUser && idToken && accessToken && refreshToken) {
        const parsedUser = JSON.parse(storedUser);

        // Verify token expiration with toast notification
        const decodedToken = jwtDecode(idToken);
        if (decodedToken.exp * 1000 < Date.now()) {
          toast.error('Your session has expired. Please log in again.', {
            duration: 5000,
            action: {
              label: 'Login',
              onClick: () => router.push('/auth/login')
            }
          });
          throw new Error('Session expired');
        }

        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      localStorage.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Enhanced login with session validation
  const login = async (credentials) => {
    try {
      setLoading(true);
      setAuthError(null);
  
      // Basic client-side validation
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
        throw new Error('Please enter a valid email address');
      }
  
      const response = await signIn(credentials);
      const { idToken, accessToken, refreshToken } = response;
      const decodedUser = jwtDecode(idToken);
      const userData = {
        userId: decodedUser["custom:userId"] || decodedUser.sub,
        email: decodedUser.email,
        name: decodedUser.name || "",
        clientId: decodedUser["custom:clientId"] || null,
        // isVerified: decodedUser.isVerified === 'true'
      };
  
      // Store tokens and user data
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('idToken', idToken);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(userData);
      router.push('/dashboard');
    } catch (error) {
      console.error("Login error:", error);
  
      let errorMessage = 'Login failed. Please try again.';
      if (error.message.includes('NotAuthorizedException')) {
        errorMessage = 'Invalid credentials';
      } else if (error.message.includes('UserNotFoundException')) {
        errorMessage = 'User not found';
      } else if (error.message.includes('UserNotConfirmedException')) {
        errorMessage = 'Please verify your email first';
      } else if (error.message.includes('TooManyFailedAttemptsException')) {
        errorMessage = 'Account temporarily locked due to too many failed attempts';
      } else if (error.message.includes('Network error')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message.includes('NOT_VERIFIED')) {
        // Handle NOT_VERIFIED case explicitly
        errorMessage = 'Your email is not verified. Please check your inbox for the verification email.';
      }
  
      setAuthError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  
  // Enhanced registration with comprehensive validation
  const register = async (userData) => {
    try {
      setLoading(true);
      setAuthError(null);

      // Client-side validation
      if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
        throw new Error('All fields are required');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        throw new Error('Please enter a valid email address');
      }

      if (userData.password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(userData.password)) {
        throw new Error('Password must contain uppercase, lowercase, number and special character');
      }

      const response = await signUp(userData);
      const newUser = {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        clientId: response.clientId,
        // isVerified: false
      };

      localStorage.setItem('tempUser', JSON.stringify(newUser));
      setUser(newUser);
      toast.success('Registration successful! Please check your email for verification.');
      router.push('/auth/login');
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = 'Registration failed. Please try again.';

      if (error.message.includes('UsernameExistsException')) {
        errorMessage = 'Email already in use';
      } else if (error.message.includes('InvalidPasswordException')) {
        errorMessage = 'Password does not meet requirements';
      } else if (error.message.includes('InvalidParameterException')) {
        errorMessage = 'Invalid registration details';
      }

      setAuthError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Forgot password functionality
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      setAuthError(null);

      if (!email) {
        throw new Error('Email is required');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      const response = await fetch('https://p12k32pylk.execute-api.us-east-1.amazonaws.com/dev/auth/forgotPwd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailId: email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reset code');
      }

      toast.success('Reset code sent to your email');
      router.push('/auth/reset-password');
    } catch (error) {
      console.error("Forgot password error:", error);
      let errorMessage = 'Failed to send reset code. Please try again.';

      if (error.message.includes('UserNotFoundException')) {
        errorMessage = 'User not found';
      } else if (error.message.includes('LimitExceededException')) {
        errorMessage = 'Too many requests. Please try again later.';
      }

      setAuthError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password functionality
  const resetPassword = async (email, confirmationCode, newPassword) => {
    try {
      setLoading(true);
      setAuthError(null);

      if (!email || !confirmationCode || !newPassword) {
        throw new Error('All fields are required');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      if (newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(newPassword)) {
        throw new Error('Password must contain uppercase, lowercase, number and special character');
      }

      const response = await fetch('https://p12k32pylk.execute-api.us-east-1.amazonaws.com/dev/auth/resetPwd', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailId: email,
          newPassword,
          confirmationCode
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      toast.success('Password reset successful');
      router.push('/auth/login');
    } catch (error) {
      console.error("Reset password error:", error);
      let errorMessage = 'Failed to reset password. Please try again.';

      if (error.message.includes('CodeMismatchException')) {
        errorMessage = 'Invalid verification code';
      } else if (error.message.includes('ExpiredCodeException')) {
        errorMessage = 'Verification code has expired';
      } else if (error.message.includes('UserNotFoundException')) {
        errorMessage = 'User not found';
      }

      setAuthError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Secure logout
  const logout = () => {
    setUser(null);
    localStorage.clear();
    sessionStorage.clear();
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      authError,
      login,
      register,
      forgotPassword,
      resetPassword,
      logout,
      setUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};