'use client';

import { useState } from 'react';
import Image from 'next/image';

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
    <>
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
          40%, 43% { transform: translateY(-10px); }
          70% { transform: translateY(-5px); }
          90% { transform: translateY(-2px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .animate-bounce { animation: bounce 1s infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .bg-clip-text { -webkit-background-clip: text; background-clip: text; }
        .text-transparent { color: transparent; }
        .backdrop-blur-sm { backdrop-filter: blur(4px); }
        .backdrop-blur-md { backdrop-filter: blur(12px); }
      `}</style>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-x-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-blue-900/20 to-slate-800/20 animate-pulse" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-bounce" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-slate-400/5 rounded-full blur-2xl animate-float" />
        </div>

        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
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
              </div>

              {/* Desktop Contact Info */}
              <div className="hidden md:flex items-center space-x-6">
                <a
                  href="tel:561-201-4365"
                  className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors hover:scale-105 transform duration-300"
                >
                  <span>📞</span>
                  <span>561-201-4365</span>
                </a>
                <a
                  href="mailto:contactautomari@gmail.com"
                  className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors hover:scale-105 transform duration-300"
                >
                  <span>✉️</span>
                  <span>contactautomari@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12 animate-fadeIn">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600/20 to-blue-600/20 backdrop-blur-sm border border-red-500/30 rounded-full px-6 py-2 mb-8 hover:scale-105 transition-transform duration-300">
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

              <p className="text-xl sm:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                Test our intelligent automation agents and see how they can transform your business operations in real-time.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center space-x-2 bg-slate-800/40 backdrop-blur-sm border border-slate-600/30 rounded-full px-4 py-2">
                  <span className="text-yellow-400">⚡</span>
                  <span className="text-sm text-slate-300">Instant Response</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-800/40 backdrop-blur-sm border border-slate-600/30 rounded-full px-4 py-2">
                  <span className="text-green-400">🛡️</span>
                  <span className="text-sm text-slate-300">Secure & Private</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-800/40 backdrop-blur-sm border border-slate-600/30 rounded-full px-4 py-2">
                  <span className="text-blue-400">🕒</span>
                  <span className="text-sm text-slate-300">24/7 Available</span>
                </div>
              </div>
            </div>

            {/* Demo Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick Prompts */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-md border border-slate-600/30 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="text-red-400 mr-2">💬</span>
                    Try These Examples
                  </h3>
                  <div className="space-y-3">
                    {quickPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickPrompt(prompt.query)}
                        className="w-full text-left p-3 bg-slate-700/30 hover:bg-slate-600/50 rounded-lg border border-slate-600/20 transition-all duration-300 text-sm text-slate-300 hover:text-white hover:scale-102 transform"
                      >
                        {prompt.text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Chat Interface */}
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-md border border-slate-600/30 rounded-2xl overflow-hidden">
                  {/* Chat Header */}
                  <div className="bg-gradient-to-r from-red-600/20 via-red-500/10 to-blue-600/20 backdrop-blur-sm p-4 border-b border-slate-600/50">
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

                  {/* Conversation Area */}
                  <div className="h-96 overflow-y-auto p-6 space-y-4">
                    {conversationHistory.length === 0 ? (
                      <div className="text-center py-8 animate-fadeIn">
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
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
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
                      <div className="flex justify-start animate-fadeIn">
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
                      </div>
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
                        className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl p-3 text-white transition-all flex-shrink-0 hover:scale-105 transform duration-300"
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

            {/* CTA Section */}
            <div className="text-center mt-12 animate-fadeIn">
              <div className="bg-gradient-to-r from-slate-800/40 to-slate-900/60 backdrop-blur-md border border-slate-600/30 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to Implement AI Agents in Your Business?
                </h3>
                <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                  Experience the power of custom AI automation. Schedule a consultation to discover how Automari can transform your operations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a
                    href="tel:561-201-4365"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-red-500/25 hover:scale-105 transform"
                  >
                    <span className="mr-2">📞</span>
                    Call 561-201-4365
                    <span className="ml-2">→</span>
                  </a>
                  <a
                    href="mailto:contactautomari@gmail.com"
                    className="inline-flex items-center px-8 py-4 border-2 border-slate-400/30 bg-slate-800/20 backdrop-blur-sm hover:bg-slate-700/30 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 transform"
                  >
                    <span className="mr-2">✉️</span>
                    Email for Demo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
          }
          .hover\\:scale-102:hover {
            transform: scale(1.02);
          }
          .hover\\:scale-105:hover {
            transform: scale(1.05);
          }
        `}</style>
      </div>
    </>
  );
}
