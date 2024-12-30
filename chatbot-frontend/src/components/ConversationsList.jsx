/**
 * ConversationsList component renders a list of conversation sessions.
 *
 * @param {Object} props - The component props.
 * @param {Array<string>} props.sessions - An array of session identifiers.
 * @param {string} props.currentSession - The identifier of the current session.
 * @param {Function} props.onSessionChange - Callback function to handle session change.
 *
 * @returns {JSX.Element} The rendered ConversationsList component.
 */
const ConversationsList = ({ sessions, currentSession, onSessionChange }) => {
    return (
        <div className="w-64 border-r p-4 hidden md:block">
            <h2 className="text-lg font-semibold mb-4">Conversations</h2>
            <div className="space-y-2">
                {sessions.map((session) => (
                    <button
                        key={session}
                        onClick={() => onSessionChange(session)}
                        className={`w-full text-left px-3 py-2 rounded-lg ${currentSession === session
                                ? 'bg-blue-100 text-blue-800'
                                : 'hover:bg-gray-100'
                            }`}
                    >
                        Session {session.slice(-6)}
                    </button>
                ))}
            </div>
        </div>
    );
};
export default ConversationsList;