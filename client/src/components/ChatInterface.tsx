import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  role: string;
  content: string;
}

export const ChatInterface: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => {
      console.log('Adding message:', message);
      console.log('Previous messages:', prev);
      return [...prev, message];
    });
  }, []);

  useEffect(() => {
    const newSocket = io('http://localhost:3001', {
      withCredentials: true,
    });
    setSocket(newSocket);

    newSocket.on('messageStart', (data: { role: string }) => {
      console.log('Message start:', data);
      setCurrentMessage({ role: data.role, content: '' });
    });

    newSocket.on('contentDelta', (data: { text: string }) => {
      console.log('Content delta:', data);
      setCurrentMessage(prev => {
        if (prev) {
          const updated = { ...prev, content: prev.content + data.text };
          console.log('Updated current message:', updated);
          return updated;
        }
        return null;
      });
    });

    newSocket.on('messageComplete', () => {
      console.log('Message complete');
      setCurrentMessage(prev => {
        if (prev) {
          console.log('Completing message:', prev);
          addMessage(prev);
          return null;
        }
        return null;
      });
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [addMessage]);

  useEffect(() => {
    console.log('Messages updated:', messages);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    console.log('Current message updated:', currentMessage);
  }, [currentMessage]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && socket) {
      const userMessage: Message = { role: 'user', content: input };
      addMessage(userMessage);
      socket.emit('sendMessage', input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
              {message.content}
            </div>
          </div>
        ))}
        {currentMessage && (
          <div className="text-left">
            <div className="inline-block p-2 rounded-lg bg-gray-200 text-black">
              {currentMessage.content}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border rounded-l-lg"
            placeholder="Type your message..."
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-lg">Send</button>
        </div>
      </form>
    </div>
  );
};