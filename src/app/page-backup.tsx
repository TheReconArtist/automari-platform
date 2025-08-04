'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: Date;
  botType?: string;
}

interface BotInfo {
  name: string;
  icon: string;
  color: string;
  description: string;
}

const botConfigs: Record<string, BotInfo> = {
  'lead-generation': {
    name: 'Lead Gen Bot',
    icon: '🎯',
    color: 'from-green-500 to-emerald-600',
    description: 'Sales & Lead Generation Specialist'
  },
  'data-analyzer': {
    name: 'Data Analyzer',
    icon: '📊',
    color: 'from-purple-500 to-violet-600',
    description: 'Business Intelligence & Analytics'
  },
  'hr-bot': {
    name: 'HR Assistant',
    icon: '👥',
    color: 'from-blue-500 to-cyan-600',
    description: 'Human Resources Automation'
  },
  'general': {
    name: 'Automari AI',
    icon: '🤖',
    color: 'from-red-500 to-blue-500',
    description: 'General Business Automation'
  }
};

export default function AutomariDemo() {
  const [message, setMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentBot, setCurrentBot] = useState<string>('general');

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: message.trim(),
      timestamp: new Date()
    };

    setConversationHistory(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch('/api/bot-router', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          userContext: {
            conversationHistory: conversationHistory.slice(-5),
            timestamp: new Date().toISOString()
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setCurrentBot(data.botType || 'general');

      const aiMessage: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: data.response,
        timestamp: new Date(),
        botType: data.botType
      };

      setConversationHistory(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error calling bot router:', error);

      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'I apologize, but I\'m experiencing a technical issue. Please try again or contact us directly at 561-201-4365.',
        timestamp: new Date(),
        botType: 'general'
      };

      setConversationHistory(prev => [...prev, errorMessage]);
    }

    setLoading(false);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickPrompts = [
    { text: "🎯 Generate qualified leads for my business", type: "lead-generation" },
    { text: "📊 Analyze my sales performance data", type: "data-analyzer" },
    { text: "👥 Automate employee onboarding process", type: "hr-bot" },
    { text: "🚀 Design custom automation strategy", type: "general" }
  ];

  const handleQuickPrompt = (prompt: string) => {
    setMessage(prompt);
  };

  const formatMessage = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={i} className="font-bold text-yellow-400 mb-1">{line.slice(2, -2)}</div>
      }
      if (line.startsWith('• ')) {
        return <div key={i} className="ml-2 mb-1">{line}</div>
      }
      if (line.startsWith('✓ ')) {
        return <div key={i} className="ml-2 mb-1 text-green-300">{line}</div>
      }
      return <div key={i} className="mb-1">{line}</div>
    });
  };

  const getCurrentBotInfo = () => {
    return botConfigs[currentBot] || botConfigs['general'];
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
                MULTI-BOT
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
              <span className="text-sm font-medium">Multi-Agent AI Demonstration</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-100 via-red-200 to-blue-200 bg-clip-text text-transparent">
                Experience Automari
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-400 via-slate-300 to-blue-400 bg-clip-text text-transparent">
                Specialized AI Agents
              </span>
            </h1>

            <p className="text-xl text-slate-300 mb-8 max-w-4xl mx-auto">
              Interact with our specialized AI agents for lead generation, data analysis, HR automation, and more.
            </p>

            {/* Bot Showcase */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
              {Object.entries(botConfigs).map(([key, bot]) => (
                <div key={key} className="bg-slate-800/40 border border-slate-600/30 rounded-xl p-4 text-center">
                  <div className={`w-12 h-12 bg-gradient-to-r ${bot.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <span className="text-2xl">{bot.icon}</span>
                  </div>
                  <h3 className="font-semibold text-white text-sm">{bot.name}</h3>
                  <p className="text-xs text-slate-400">{bot.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Demo Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Prompts */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800/60 backdrop-blur-md border border-slate-600/30 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="text-red-400 mr-2">🎪</span>
                  Try Different Agents
                </h3>
                <div className="space-y-3">
                  {quickPrompts.map((prompt, index) => {
                    const botInfo = botConfigs[prompt.type];
                    return (
                      <button
                        key={index}
                        onClick={() => handleQuickPrompt(prompt.text)}
                        className="w-full text-left p-3 bg-slate-700/30 hover:bg-slate-600/50 rounded-lg border border-slate-600/20 transition-all duration-300 text-sm text-slate-300 hover:text-white"
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <span>{botInfo.icon}</span>
                          <span className="font-medium">{botInfo.name}</span>
                        </div>
                        <div className="text-xs opacity-80">{prompt.text.replace(/^[^\s]+\s/, '')}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800/60 backdrop-blur-md border border-slate-600/30 rounded-2xl overflow-hidden">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-red-600/20 to-blue-600/20 p-4 border-b border-slate-600/50">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${getCurrentBotInfo().color} rounded-full flex items-center justify-center`}>
                      <span className="text-white text-lg">{getCurrentBotInfo().icon}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{getCurrentBotInfo().name}</h3>
                      <p className="text-xs text-slate-300">{getCurrentBotInfo().description}</p>
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
                      <h4 className="text-lg font-semibold text-white mb-2">Welcome to Automari Multi-Agent Demo</h4>
                      <p className="text-slate-400 text-sm">
                        Ask about lead generation, data analysis, HR automation, or general business automation.
                      </p>
                    </div>
                  ) : (
                    conversationHistory.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-2xl ${msg.sender === 'user'
                              ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-br-md'
                              : 'bg-slate-700/50 text-slate-100 rounded-bl-md'
                            }`}
                        >
                          {msg.sender === 'ai' && msg.botType && (
                            <div className="flex items-center space-x-2 mb-2 opacity-75">
                              <span className="text-xs">{botConfigs[msg.botType]?.icon}</span>
                              <span className="text-xs font-medium">{botConfigs[msg.botType]?.name}</span>
                            </div>
                          )}
                          <div className="text-sm leading-relaxed">
                            {formatMessage(msg.text)}
                          </div>
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
                          <span className="text-xs text-slate-400">AI agents analyzing...</span>
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
                      placeholder="Ask about lead generation, data analysis, HR automation, or any business process..."
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
                    Multi-Agent Demo • Powered by Automari AI + n8n Workflows
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}