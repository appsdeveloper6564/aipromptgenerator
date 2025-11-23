import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { sendChatMessage } from '../services/geminiService';
import { ChatMessage } from '../types';

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Hello! I am PromptMaster AI. Ask me anything about prompts, coding, or app development.', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Format history for API
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await sendChatMessage(userMsg.text, history);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, modelMsg]);
    setLoading(false);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col max-w-4xl mx-auto bg-white dark:bg-brand-card rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
      <div className="p-4 bg-gradient-to-r from-brand-purple to-brand-red text-white flex justify-between items-center">
        <h3 className="font-bold flex items-center gap-2">
          <Bot size={20} /> Gemini 3 Pro Chat
        </h3>
        <span className="text-xs bg-white/20 px-2 py-1 rounded">Smart Assistant</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
              ${msg.role === 'user' ? 'bg-brand-orange' : 'bg-brand-purple'}
              text-white
            `}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`
              max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed
              ${msg.role === 'user' 
                ? 'bg-brand-orange/10 text-gray-900 dark:text-white rounded-tr-none border border-brand-orange/20' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none'
              }
            `}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-purple flex items-center justify-center text-white">
              <Bot size={16} />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none">
              <Loader2 className="animate-spin text-gray-500" size={20} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything..."
            className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-brand-purple outline-none dark:text-white"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="p-3 bg-brand-purple text-white rounded-xl hover:bg-brand-purple/90 disabled:opacity-50 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
