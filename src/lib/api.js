const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Session token management
let sessionToken = localStorage.getItem('sessionToken') || null;

export function setSessionToken(token) {
    sessionToken = token;
    if (token) {
        localStorage.setItem('sessionToken', token);
    } else {
        localStorage.removeItem('sessionToken');
    }
}

export function getSessionToken() {
    return sessionToken;
}

// Helper function to make API requests with authentication
async function apiRequest(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (sessionToken) {
        headers['Authorization'] = `Bearer ${sessionToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include'
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

// ============ AUTH API ============

export const register = async (email, password) => {
    try {
        const data = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, provider: 'email' })
        });

        setSessionToken(data.sessionToken);
        return data.user;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
};

export const login = async (email, password, provider = 'email') => {
    try {
        const body = provider === 'email' ? { email, password, provider } : { email, provider };
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(body)
        });

        setSessionToken(data.sessionToken);
        return data.user;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await apiRequest('/auth/logout', {
            method: 'POST'
        });
        setSessionToken(null);
    } catch (error) {
        console.error('Logout failed:', error);
        // Clear session even if request fails
        setSessionToken(null);
    }
};

export const fetchUserContext = async () => {
    try {
        return await apiRequest('/userContext');
    } catch (error) {
        console.error('Failed to fetch user context:', error);
        throw error;
    }
};

// ============ STREAM API ============

// ============ ROOM API ============

export const createRoom = async (name) => {
    try {
        return await apiRequest('/rooms', {
            method: 'POST',
            body: JSON.stringify({ name })
        });
    } catch (error) {
        console.error('Failed to create room:', error);
        throw error;
    }
};

export const fetchRooms = async () => {
    try {
        return await apiRequest('/rooms');
    } catch (error) {
        console.error('Failed to fetch rooms:', error);
        throw error;
    }
};

export const fetchRoomDetails = async (roomId) => {
    try {
        return await apiRequest(`/rooms/${roomId}`);
    } catch (error) {
        console.error('Failed to fetch room details:', error);
        throw error;
    }
};

// ============ STREAM API ============

export const createStream = async (url, roomId) => {
    try {
        return await apiRequest('/streams', {
            method: 'POST',
            body: JSON.stringify({ url, roomId })
        });
    } catch (error) {
        console.error('Failed to create stream:', error);
        throw error;
    }
};

export const fetchStreams = async (roomId) => {
    try {
        return await apiRequest(`/streams/${roomId}`);
    } catch (error) {
        console.error('Failed to fetch streams:', error);
        throw error;
    }
};

export const fetchStreamsPublic = async () => {
    // Deprecated or needs update for public rooms
    return [];
};

export const upvoteStream = async (streamId) => {
    try {
        return await apiRequest('/streams/upvote', {
            method: 'POST',
            body: JSON.stringify({ streamId })
        });
    } catch (error) {
        console.error('Failed to upvote stream:', error);
        throw error;
    }
};

export const deleteStream = async (streamId) => {
    try {
        return await apiRequest(`/streams/${streamId}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Failed to delete stream:', error);
        throw error;
    }
};
