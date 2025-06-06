import { useState } from 'react';
import { FiSend, FiUpload } from 'react-icons/fi';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() && !image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('input', input);
    if (image) formData.append('image', image);

    const newMessages = [...messages, { role: 'user', content: input || '🖼️ Gambar' }];
    setMessages(newMessages);
    setInput('');
    setImage(null);

    const response = await fetch('/api/chat', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setMessages(prev => [...newMessages, { role: 'assistant', content: data.reply }]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <header className="p-4 text-2xl font-bold text-center shadow">JunAi</header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={\`p-3 rounded-xl max-w-xs \${msg.role === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100 mr-auto'}\`}>
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="mr-auto bg-gray-200 p-3 rounded-xl max-w-xs animate-pulse">
            JunAi sedang berpikir...
          </div>
        )}
      </div>

      <footer className="p-4 flex items-center gap-2 border-t">
        <input
          className="flex-1 p-2 rounded-full border focus:outline-none"
          placeholder="Tanyakan apa saja..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="p-2 bg-gray-200 rounded-full cursor-pointer">
          <FiUpload />
        </label>
        <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded-full">
          <FiSend />
        </button>
      </footer>
    </div>
  );
}