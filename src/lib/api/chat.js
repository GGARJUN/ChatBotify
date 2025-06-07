// lib/api/chat.ts

  export async function sendChatMessage(
    payload,
    token,
    signal
  ){
    const response = await fetch(
      'https://u9pvrypbbl.execute-api.us-east-1.amazonaws.com/prod/rccs/rcpu/query', 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        signal,
      }
    );
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to process chat message.');
    }
  
    return await response.json();
  }