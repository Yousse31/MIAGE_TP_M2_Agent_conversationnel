import { useState } from 'react';
/**
 * MessageInput component allows users to type and send messages.
 *
 * @param {Object} props - The component props.
 * @param {function} props.onSendMessage - Function to call when a message is sent.
 * @param {boolean} props.isLoading - Indicates if a message is currently being sent.
 *
 * @returns {JSX.Element} The rendered MessageInput component.
 */
const MessageInput = ({ onSendMessage, isLoading }) => {
    const [message, setMessage] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };
    return (
        <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
            />
            <button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg bg-blue-500 text-white
    ${isLoading ? 'opacity-50' : 'hover:bg-blue-600'}`}
            >
                {isLoading ? 'Sending...' : 'Send'}
            </button>
        </form>
    );
};
export default MessageInput;