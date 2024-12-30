import { useEffect, useRef } from 'react';
import Message from './Message';
/**
 * ChatWindow component renders a list of chat messages and automatically scrolls to the bottom when new messages are added.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.messages - An array of message objects to be displayed in the chat window.
 * @returns {JSX.Element} The rendered chat window component.
 */
const ChatWindow = ({ messages }) => {
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    return (
        <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message, index) => (
                <Message
                    key={index}
                    message={message}
                    isUser={message.role === 'user'}
                />
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};
export default ChatWindow;
