'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Bot,
  Send,
  Sparkles,
  Phone,
  Mail,
  ArrowRight,
  MessageSquare,
  Zap,
  Shield,
  Clock
} from 'lucide-react';

export default function AutomariDemo() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: message.trim(),
      timestamp: new Date()
    };

    setConversationHistory(prev => [...prev, userMessage]);
    setLoading(true);
    
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      
      const data = await res.json();
      const aiResponse = data.response || data.error;
      
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date()
      };

      setConversationHistory(prev => [...prev, aiMessage]);
      setResponse(aiResponse);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Error: Could not connect to AI service. Please try again.',
        timestamp: new Date()
      };
      setConversationHistory(prev => [...prev, errorMessage]);
      setResponse('Error: Could not connect to AI service');
    }
    
    setLoading(false);
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickPrompts = [
    {
      text: "🎯 Analyze my customer support bottlenecks",
      query: "Help me identify and solve customer support bottlenecks in my business"
    },
    {
      text: "📧 Automate email management workflow", 
      query: "How can I automate my email management and response workflow?"
    },
    {
      text: "💰 Calculate ROI for automation",
      query: "Calculate the potential ROI of implementing business automation"
    },
    {
      text: "🚀 Design custom AI agent strategy",
      query: "Design a custom AI agent strategy for my specific business needs"
    }
  ];

  const handleQuickPrompt = (query) => {
    setMessage(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-blue-900/20 to-slate-800/20 animate-pulse" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-bounce" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-slate-400/5 rounded-full blur-2xl" />
      </div>

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 w-full z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-700/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.05 }}>
              <div className="relative w-10 h-10">
                <Image
                  src="/automari-logo.png"
                  alt="Automari Logo"
                  width={40}
                  height={40}
                  className="object-contain rounded-lg"
                  style={{ background: 'transparent' }}
                  priority
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-400 via-slate-200 to-blue-400 bg-clip-text text-transparent">
                Automari
              </span>
              <span className="text-sm bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent font-semibold">
                DEMO
              </span>
            </motion.div>

            {/* Desktop Contact Info */}
            <div className="hidden md:flex items-center space-x-6">
              <motion.a
                href="tel:561-201-4365"
                className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Phone className="h-4 w-4" />
                <span>561-201-4365</span>
              </motion.a>
              <motion.a
                href="mailto:contactautomari@gmail.com"
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Mail className="h-4 w-4" />
                <span>contactautomari@gmail.com</span>
              </motion.a>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600/20 to-blue-600/20 backdrop-blur-sm border border-red-500/30 rounded-full px-6 py-2 mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="h-4 w-4 text-red-400" />
              <span className="text-sm font-medium">Live AI Agent Demonstration</span>
            </motion.div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-100 via-red-200 to-blue-200 bg-clip-text text-transparent">
                Experience Automari
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-400 via-slate-300 to-blue-400 bg-clip-text text-transparent">
                AI Agents Live
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Test our intelligent automation agents and see how they can transform your business operations in real-time.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center space-x-2 bg-slate-800/40 backdrop-blur-sm border border-slate-600/30 rounded-full px-4 py-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-slate-300">Instant Response</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-800/40 backdrop-blur-sm border border-slate-600/30 rounded-full px-4 py-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-sm text-slate-300">Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-800/40 backdrop-blur-sm border border-slate-600/30 rounded-full px-4 py-2">
                <Clock className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-slate-300">24/7 Available</span>
              </div>
            </div>
          </motion.div>

          {/* Demo Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Prompts */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-md border border-slate-600/30 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <MessageSquare className="h-5 w-5 text-red-400 mr-2" />
                  Try These Examples
                </h3>
                <div className="space-y-3">
                  {quickPrompts.map((prompt, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleQuickPrompt(prompt.query)}
                      className="w-full text-left p-3 bg-slate-700/30 hover:bg-slate-600/50 rounded-lg border border-slate-600/20 transition-all duration-300 text-sm text-slate-300 hover:text-white"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {prompt.text}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Main Chat Interface */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-md border border-slate-600/30 rounded-2xl overflow-hidden">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-red-600/20 via-red-500/10 to-blue-600/20 backdrop-blur-sm p-4 border-b border-slate-600/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Automari AI Agent</h3>
                      <p className="text-xs text-slate-300">Business Automation Specialist</p>
                    </div>
                    <div className="ml-auto">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-400">Online</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conversation Area */}
                <div className="h-96 overflow-y-auto p-6 space-y-4">
                  {conversationHistory.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-8"
                    >
                      <Bot className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-white mb-2">Welcome to Automari AI Demo</h4>
                      <p className="text-slate-400 text-sm">
                        Ask me about business automation, AI agents, or try one of the example prompts.
                      </p>
                    </motion.div>
                  ) : (
                    conversationHistory.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-2xl ${
                            msg.sender === 'user'
                              ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-br-md'
                              : 'bg-slate-700/50 text-slate-100 rounded-bl-md'
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                          <p className="text-xs opacity-70 mt-2">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}

                  {loading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-slate-700/50 text-slate-100 rounded-2xl rounded-bl-md p-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                          </div>
                          <span className="text-xs text-slate-400">AI is analyzing...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-slate-600/50 bg-slate-800/50">
                  <div className="flex items-end space-x-3">
                    <div className="flex-1">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about business automation, AI agents, or operational challenges..."
                        className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all resize-none"
                        rows={2}
                        disabled={loading}
                      />
                    </div>
                    <button
                      onClick={sendMessage}
                      disabled={!message.trim() || loading}
                      className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl p-3 text-white transition-all flex-shrink-0"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 text-center">
                    Demo Mode • Press Enter to send • Powered by Automari AI
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="bg-gradient-to-r from-slate-800/40 to-slate-900/60 backdrop-blur-md border border-slate-600/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Implement AI Agents in Your Business?
              </h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Experience the power of custom AI automation. Schedule a consultation to discover how Automari can transform your operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.a
                  href="tel:561-201-4365"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call 561-201-4365
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.a>
                <motion.a
                  href="mailto:contactautomari@gmail.com"
                  className="inline-flex items-center px-8 py-4 border-2 border-slate-400/30 bg-slate-800/20 backdrop-blur-sm hover:bg-slate-700/30 text-white font-semibold rounded-full transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Email for Demo
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
