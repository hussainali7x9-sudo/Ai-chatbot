import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Bot, Send, User, Loader2, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Create refs
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null); // <- NEW: Input focus ref

  // Auto-scroll function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end'
    });
  };

  // Scroll whenever messages change or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Auto-focus input after messages update
  useEffect(() => {
    // Focus input when messages change (after sending/receiving)
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [messages, isLoading]);

  // Generate floating particles
  useEffect(() => {
    const createParticles = () => {
      const container = document.getElementById('particles');
      if (!container) return;
      
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 6 + 4) + 's';
        container.appendChild(particle);
      }
    };
    createParticles();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        messages: [...messages, userMessage]
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.reply
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Error: Could not get response'
      }]);
    } finally {
      setIsLoading(false);
      // Focus will happen automatically via the useEffect
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Liquid Background */}
      <div className="liquid-bg">
        <div className="liquid-blob"></div>
        <div className="liquid-blob"></div>
        <div className="liquid-blob"></div>
      </div>

      {/* Cyber Grid */}
      <div className="cyber-grid"></div>

      {/* Floating Particles */}
      <div id="particles"></div>

      {/* Main Chat Container */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-3xl h-[85vh] chat-container rounded-3xl flex flex-col overflow-hidden"
      >
        {/* Header with Cyber Effect */}
        <div className="gradient-border flex-shrink-0">
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-4 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-2.5 rounded-full">
                  <Bot className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2 neon-glow">
                  AI Chatbot
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </h1>
                <p className="text-xs text-purple-300/60 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full inline-block animate-pulse"></span>
                  Powered by Groq AI
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-white/5 rounded-full text-xs text-purple-300/60 border border-white/10 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span className="hidden sm:inline">qwen-27b</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Bot className="w-20 h-20 text-purple-400/30 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white/40 neon-glow">Start a Conversation</h3>
              <p className="text-purple-300/30 max-w-md mt-2">
                Ask me anything about geography, COMSATS, or just chat!
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start gap-3 message-enter ${
                    msg.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`flex-shrink-0 ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  } p-2 rounded-full shadow-lg shadow-purple-500/20`}>
                    {msg.role === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/20'
                        : 'bg-white/5 backdrop-blur-sm border border-white/10'
                    }`}
                  >
                    <p className="text-white/90 text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3"
            >
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full shadow-lg shadow-purple-500/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input - with ref for auto-focus */}
        <form onSubmit={sendMessage} className="flex-shrink-0 p-4 border-t border-white/5 bg-slate-900/50 backdrop-blur-sm">
          <div className="relative flex items-center gap-2">
            <input
              ref={inputRef} // <- NEW: ref attached to input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 
                       text-white placeholder-purple-300/30 focus:outline-none 
                       focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20
                       transition-all duration-300 disabled:opacity-50"
            />
            <motion.button
              type="submit"
              disabled={!input.trim() || isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group p-3 bg-gradient-to-r from-purple-500 to-pink-500 
                       rounded-full hover:shadow-lg hover:shadow-purple-500/30 
                       transition-all duration-300 disabled:opacity-50 
                       disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 
                            rounded-full blur-xl opacity-50 group-hover:opacity-75 
                            transition-opacity"></div>
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-white animate-spin relative" />
              ) : (
                <Send className="w-5 h-5 text-white relative" />
              )}
            </motion.button>
          </div>
          <div className="flex justify-center mt-2">
            <div className="flex items-center gap-2 text-xs text-purple-300/30">
              <Sparkles className="w-3 h-3" />
              <span>Powered by Groq AI • qwen-27b model</span>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default App;