'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: Date;
}

export default function AutomariDemo() {
  const [message, setMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

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
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Error: Could not connect to AI service. Please try again.',
        timestamp: new Date()
      };
      setConversationHistory(prev => [...prev, errorMessage]);
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
    "🎯 Analyze my customer support bottlenecks",
    "📧 Automate email management workflow", 
    "💰 Calculate ROI for automation",
    "🚀 Design custom AI agent strategy"
  ];

  const handleQuickPrompt = (prompt) => {
    setMessage(prompt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/automari-logo.png"
                  alt="Automari Logo"
                  width={40}
                  height={40}
                  className="object-contain rounded-lg"
                  priority
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-400 via-slate-200 to-blue-400 bg-clip-text text-transparent">
                Automari
              </span>
              <span className="text-sm bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent font-semibold">
                DEMO
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <a
                href="tel:561-201-4365"
                className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
              >
                <span>📞</span>
                <span>561-201-4365</span>
              </a>
              <a
                href="mailto:contactautomari@gmail.com"
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span>✉️</span>
                <span>contactautomari@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-full px-6 py-2 mb-8">
              <span className="text-yellow-400">✨</span>
              <span className="text-sm font-medium">Live AI Agent Demonstration</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-100 via-red-200 to-blue-200 bg-clip-text text-transparent">
                Experience Automari
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-400 via-slate-300 to-blue-400 bg-clip-text text-transparent">
                AI Agents Live
              </span>
            </h1>

            <p className="text-xl text-slate-300 mb-8 max-w-4xl mx-auto">
              Test our intelligent automation agents and see how they can transform your business operations in real-time.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center space-x-2 bg-slate-800/40 border border-slate-600/30 rounded-full px-4 py-2">
                <span className="text-yellow-400">⚡</span>
                <span className="text-sm text-slate-300">Instant Response</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-800/40 border border-slate-600/30 rounded-full px-4 py-2">
                <span className="text-green-400">🛡️</span>
                <span className="text-sm text-slate-300">Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-800/40 border border-slate-600/30 rounded-full px-4 py-2">
                <span className="text-blue-400">🕒</span>
                <span className="text-sm text-slate-300">24/7 Available</span>
              </div>
            </div>
          </div>

          {/* Demo Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Prompts */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800/60 backdrop-blur-md border border-slate-600/30 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="text-red-400 mr-2">💬</span>
                  Try These Examples
                </h3>
                <div className="space-y-3">
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickPrompt(prompt)}
                      className="w-full text-left p-3 bg-slate-700/30 hover:bg-slate-600/50 rounded-lg border border-slate-600/20 transition-all duration-300 text-sm text-slate-300 hover:text-white"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800/60 backdrop-blur-md border border-slate-600/30 rounded-2xl overflow-hidden">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-red-600/20 to-blue-600/20 p-4 border-b border-slate-600/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white">🤖</span>
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

                {/* Messages */}
                <div className="h-96 overflow-y-auto p-6 space-y-4">
                  {conversationHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">🤖</div>
                      <h4 className="text-lg font-semibold text-white mb-2">Welcome to Automari AI Demo</h4>
                      <p className="text-slate-400 text-sm">
                        Ask me about business automation, AI agents, or try one of the example prompts.
                      </p>
                    </div>
                  ) : (
                    conversationHistory.map((msg) => (
                      <div
                        key={msg.id}
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
                      </div>
                    ))
                  )}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-700/50 text-slate-100 rounded-2xl rounded-bl-md p-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-xs text-slate-400">AI is analyzing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-600/50 bg-slate-800/50">
                  <div className="flex items-end space-x-3">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about business automation, AI agents, or operational challenges..."
                      className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all resize-none"
                      rows={2}
                      disabled={loading}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!message.trim() || loading}
                      className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl p-3 text-white transition-all"
                    >
                      <span className="text-lg">📤</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 text-center">
                    Demo Mode • Press Enter to send • Powered by Automari AI
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <div className="bg-slate-800/40 backdrop-blur-md border border-slate-600/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Implement AI Agents in Your Business?
              </h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Experience the power of custom AI automation. Schedule a consultation to discover how Automari can transform your operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="tel:561-201-4365"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white font-semibold rounded-full transition-all duration-300 shadow-lg"
                >
                  <span className="mr-2">📞</span>
                  Call 561-201-4365
                  <span className="ml-2">→</span>
                </a>
                <a
                  href="mailto:contactautomari@gmail.com"
                  className="inline-flex items-center px-8 py-4 border-2 border-slate-400/30 bg-slate-800/20 hover:bg-slate-700/30 text-white font-semibold rounded-full transition-all duration-300"
                >
                  <span className="mr-2">✉️</span>
                  Email for Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
