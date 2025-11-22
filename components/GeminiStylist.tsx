import React, { useState, useRef, useEffect, useContext } from 'react';
import { Chat, GenerateContentResponse } from "@google/genai";
import { createChatSession, dispatchLog } from '../services/geminiService';
import { ShopContext } from '../App';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const GeminiStylist: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { products } = useContext(ShopContext);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hi! I\'m Lumi, your personal stylist. Looking for something specific or need outfit inspiration?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat session
  useEffect(() => {
    if (isOpen && !chatSessionRef.current) {
      try {
        chatSessionRef.current = createChatSession(products);
      } catch (e) {
        console.error("Failed to init chat", e);
        dispatchLog('error', 'Failed to initialize Chat Session', { error: String(e) });
      }
    }
  }, [isOpen]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    dispatchLog('ai-request', 'Stylist Chat Message', { message: userMsg });

    try {
      const response: GenerateContentResponse = await chatSessionRef.current.sendMessage({ message: userMsg });
      const text = response.text || "Sorry, I didn't catch that.";

      setMessages(prev => [...prev, { role: 'model', text }]);
      dispatchLog('ai-response', 'Stylist Chat Response', { response: text });
    } catch (error) {
      console.error(error);
      dispatchLog('error', 'Stylist Chat Error', { error: String(error) });
      setMessages(prev => [...prev, { role: 'model', text: "I'm having a bit of trouble connecting. Try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[500px] animate-fade-in-up">
          {/* Header */}
          <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <div>
                <h3 className="font-bold text-sm">Lumi Stylist</h3>
                <p className="text-xs text-indigo-200">Powered by Gemini</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-indigo-200 hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-sm text-gray-500">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <input
                type="text"
                className="flex-1 border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Ask for advice..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-full shadow-lg transition-all hover:scale-105"
        >
          <span className="text-lg">✨</span>
          <span className="font-medium">Ask Stylist</span>
        </button>
      )}
    </div>
  );
};