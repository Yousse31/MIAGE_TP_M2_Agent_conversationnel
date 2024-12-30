import { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import ConversationsList from './components/ConversationsList';
import Loader from './components/Loader';
import ErrorNotification from './components/ErrorNotification';
import { chatApi } from './services/api';

/**
 * The main application component that handles chat sessions and messages.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * <App />
 *
 * @typedef {Object} Message
 * @property {string} role - The role of the message sender (e.g., 'user', 'assistant').
 * @property {string} content - The content of the message.
 *
 * @typedef {Object} Session
 * @property {string} id - The unique identifier for the session.
 *
 * @typedef {Object} ChatApi
 * @property {Function} getAllSessions - Fetches all chat sessions.
 * @property {Function} getHistory - Fetches the message history for a given session.
 * @property {Function} sendMessage - Sends a message to the chat API.
 *
 * @typedef {Object} Props
 * @property {ChatApi} chatApi - The chat API object with methods to interact with the backend.
 *
 * @param {Props} props - The props for the component.
 *
 * @property {Array<Message>} messages - The list of messages in the current session.
 * @property {Function} setMessages - The state setter for messages.
 * @property {Array<Session>} sessions - The list of chat sessions.
 * @property {Function} setSessions - The state setter for sessions.
 * @property {string|null} currentSession - The current chat session ID.
 * @property {Function} setCurrentSession - The state setter for the current session.
 * @property {boolean} isLoading - The loading state for sending messages.
 * @property {Function} setIsLoading - The state setter for the loading state.
 * @property {string|null} error - The error message, if any.
 * @property {Function} setError - The state setter for the error message.
 *
 * @function loadSessions - Loads all chat sessions from the API.
 * @function loadHistory - Loads the message history for the current session from the API.
 * @function handleSendMessage - Sends a message to the chat API and updates the message list.
 */
function App() {
    const [messages, setMessages] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [currentSession, setCurrentSession] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const newSession = `session-${Date.now()}`;
        setCurrentSession(newSession);
        loadSessions();
    }, []);

    useEffect(() => {
        if (currentSession) {
            loadHistory();
        }
    }, [currentSession]);

    const loadSessions = async () => {
        try {
            const response = await chatApi.getAllSessions();
            setSessions(response);
        } catch (error) {
            console.error('Error loading sessions:', error);
            setError('Error loading sessions');
        }
    };

    const loadHistory = async () => {
        try {
            const history = await chatApi.getHistory(currentSession);
            setMessages(history);
        } catch (error) {
            console.error('Error loading history:', error);
            setError('Error loading history');
        }
    };

    const handleSendMessage = async (content) => {
        if (!currentSession) return;
        setIsLoading(true);
        try {
            const response = await chatApi.sendMessage(content, currentSession);
            setMessages(prev => [...prev,
                { role: 'user', content },
                { role: 'assistant', content: response.response }
            ]);
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Error sending message');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-white">
            <ConversationsList
                sessions={sessions}
                currentSession={currentSession}
                onSessionChange={setCurrentSession}
            />
            <div className="flex-1 flex flex-col">
                <ChatWindow messages={messages} />
                <MessageInput
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                />
                {isLoading && <Loader />}
                {error && <ErrorNotification message={error} />}
            </div>
        </div>
    );
}

export default App;