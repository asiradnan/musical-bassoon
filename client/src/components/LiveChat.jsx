import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageSquare, X, Send } from 'lucide-react';
import { toggleChat, addMessage } from '../slices/chatSlice';
import io from 'socket.io-client';

const SOCKET_URL = process.env.NODE_ENV === 'production' 
  ? window.location.origin 
  : 'http://localhost:5000';

const LiveChat = () => {
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  
  const dispatch = useDispatch();
  const { isOpen, messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  
  // Initialize socket connection
  useEffect(() => {
    if (isOpen && !socket) {
      const newSocket = io(SOCKET_URL);
      
      newSocket.on('connect', () => {
        console.log('Connected to chat server');
        
        // Add welcome message if no messages yet
        if (messages.length === 0) {
          dispatch(
            addMessage({
              text: 'Welcome to our live chat support! How can we help you today?',
              isUser: false,
              timestamp: new Date().toISOString(),
            })
          );
        }
      });
      
      newSocket.on('message', (msg) => {
        if (msg.userId !== (user?._id || 'guest')) {
          dispatch(
            addMessage({
              text: msg.text,
              isUser: false,
              timestamp: new Date().toISOString(),
            })
          );
        }
      });
      
      setSocket(newSocket);
      
      return () => {
        newSocket.disconnect();
      };
    }
  }, [isOpen, socket, dispatch, messages.length, user]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    const newMessage = {
      text: message,
      isUser: true,
      timestamp: new Date().toISOString(),
    };
    
    dispatch(addMessage(newMessage));
    
    if (socket) {
      socket.emit('message', {
        text: message,
        userId: user?._id || 'guest',
        name: user?.name || 'Guest',
      });
    }
    
    setMessage('');
  };
  
  if (!isOpen) {
    return (
      <button
        onClick={() => dispatch(toggleChat())}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition z-50"
      >
        <MessageSquare size={24} />
      </button>
    );
  }
  
  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3 className="font-semibold">Live Support</h3>
        <button onClick={() => dispatch(toggleChat())}>
          <X size={20} />
        </button>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${
              msg.isUser ? 'chat-message-user' : 'chat-message-support'
            }`}
          >
            <p>{msg.text}</p>
            <small className="text-xs text-gray-500">
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </small>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="chat-input">
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-2 rounded-r-md hover:bg-blue-700 transition"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default LiveChat;