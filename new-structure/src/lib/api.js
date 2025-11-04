// Example of how to use environment variables in Vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Example of a function that fetches data from the backend
export const fetchUserContext = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/userContext`, {
      credentials: 'include' // Include cookies/session data
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user context:', error);
    throw error;
  }
};

// Example of a function that posts data to the backend
export const createStream = async (streamData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/streams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(streamData),
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to create stream:', error);
    throw error;
  }
};

// Example of a function that updates data on the backend
export const upvoteStream = async (streamId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/streams/upvote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ streamId }),
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to upvote stream:', error);
    throw error;
  }
};