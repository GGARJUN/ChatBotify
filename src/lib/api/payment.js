// lib/api/payment.ts

import { toast } from 'sonner';


const API_BASE_URL =
  'https://p12k32pylk.execute-api.us-east-1.amazonaws.com/dev'; 

export async function initPayment(
  payload,
  token
) {
  const response = await fetch(`${API_BASE_URL}/rc/pay/init`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.error || 'Failed to initiate payment.';
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }

  const data = await response.json();

  if (!data.checkoutUrl) {
    const errorMsg = 'No checkout URL provided by the server.';
    toast.error(errorMsg);
    throw new Error(errorMsg);
  }

  return data;
}
// File: lib/api/payment.js
export async function checkSubscriptionStatus(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/rc/pay/check`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to check subscription status: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    // Validate response structure
    if (typeof result === 'boolean') {
      return result;
    } else {
      console.warn('Unexpected response format:', result);
      return false;
    }
  } catch (error) {
    console.error('Error checking subscription:', error.message);
    return false;
  }
}