import { useState } from 'react';
import { askAssistant } from '../api/reports';
import { MessageCircle, X, Send } from 'lucide-react';

function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSend(e) {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = { role: 'user', text: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      const data = await askAssistant(question);
      setMessages((prev) => [...prev, { role: 'assistant', text: data.answer }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Sorry, something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
      >
        <MessageCircle size={22} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white rounded-xl border border-gray-200 shadow-xl flex flex-col" style={{ height: 420 }}>
      <div className="flex justify-between items-center p-3 border-b border-gray-100">
        <p className="text-sm font-semibold text-gray-800">Team Assistant</p>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.length === 0 && (
          <p className="text-xs text-gray-400">
            Ask me things like "What blockers is the team facing?" or "What did Alex work on last week?"
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`text-sm p-2 rounded-lg max-w-[90%] ${
              m.role === 'user' ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && <p className="text-xs text-gray-400">Thinking...</p>}
      </div>

      <form onSubmit={handleSend} className="flex gap-2 p-3 border-t border-gray-100">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

export default ChatAssistant;