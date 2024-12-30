import axios from 'axios';
const API_URL = 'http://localhost:8000';
export const chatApi = {
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