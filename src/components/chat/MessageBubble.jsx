const MessageBubble = ({ message, isOwn }) => (
  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
        isOwn
          ? 'rounded-br-sm bg-bordo-600 text-white'
          : 'rounded-bl-sm bg-xaki-100 text-siyoh-800 dark:bg-siyoh-700 dark:text-xaki-50'
      }`}
    >
      <p>{message.text}</p>
      <span className={`mt-1 block text-[10px] ${isOwn ? 'text-bordo-100' : 'text-siyoh-400 dark:text-xaki-400'}`}>
        {new Date(message.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  </div>
);

export default MessageBubble;
