/**
 * Message component to display a chat message.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.message - The message object containing the content.
 * @param {string} props.message.content - The content of the message.
 * @param {boolean} props.isUser - A flag indicating if the message is from the user.
 * @returns {JSX.Element} The rendered Message component.
 */
const Message = ({ message, isUser }) => {
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`rounded-lg px-4 py-2 max-w-[70%] ${isUser
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
            >
                {message.content}
            </div>
        </div>
    );
};
export default Message;