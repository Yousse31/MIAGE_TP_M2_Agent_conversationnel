import axios from 'axios';
const API_URL = 'http://localhost:8000';
/**
 * Chat API service for interacting with the backend.
 */
export const chatApi = {
    /**
     * Sends a message to the chat API.
     * @param {string} message - The message to send.
     * @param {string} sessionId - The session ID.
     * @returns {Promise<Object>} The response data from the API.
     */
    sendMessage: async (message, sessionId) => {
        // Implementation here...
    },

    /**
     * Retrieves the chat history for a given session.
     * @param {string} sessionId - The session ID.
     * @returns {Promise<Object>} The response data from the API.
     */
    getHistory: async (sessionId) => {
        // Implementation here...
    },

    /**
     * Retrieves all chat sessions.
     * @returns {Promise<Object>} The response data from the API.
     */
    getAllSessions: async () => {
        // Implementation here...
    }
};
sendMessage: async (message, sessionId) => {
const response = await axios.post(`${API_URL}/chat`, {
message,
session_id: sessionId
});
return response.data;
},
getHistory: async (sessionId) => {
const response = await axios.get(`${API_URL}/history/${sessionId}`);
return response.data;
},
getAllSessions: async () => {
const response = await axios.get(`${API_URL}/sessions`);
return response.data;
}
};