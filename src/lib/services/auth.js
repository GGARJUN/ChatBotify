import { signIn, signOut, fetchAuthSession } from '@aws-amplify/auth';
import axios from 'axios';
import { Amplify } from 'aws-amplify';

const API_BASE_URL = process.env.NEXT_PUBLIC_AWS_API_BASE_URL;

export const authServices = {
  register: async (payload) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signUp`, payload);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  login: async ({ email, password }) => {
    try {
      console.log('Amplify config before signIn:', Amplify.getConfig());
      const result = await signIn({
        username: email,
        password,
        options: {
          authFlowType: 'USER_PASSWORD_AUTH', // Explicitly set
        },
      });
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  forgotPasswordGetCode: async (payload) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/forgotPwd`, payload);
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  resetPassword: async (payload) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/auth/resetPwd`, payload);
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  getAuthenticatUser: async () => {
    try {
      const session = await fetchAuthSession();
      return session;
    } catch (error) {
      console.error('Error fetching auth session:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },
};