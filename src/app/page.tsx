'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: Date;
}

interface LeadData {
  name: string;
  email: string;
  company: string;
  message: string;
  phone?: string;
  source: string;
}

export default function AutomariDemo() {
  const [message, setMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadData, setLeadData] = useState<LeadData>({
    name: '',
    email: '',
    company: '',
    message: '',
    phone: '',
    source: 'demo'
  });

  const simulateLeadProcessing = async (lead: LeadData) => {
    // Simulate AI qualification based on message content
    const lowerMessage = lead.message.toLowerCase();
    let score = 30; // Base score

    const hasUrgentKeywords = lowerMessage.includes('urgent') || lowerMessage.includes('asap') || lowerMessage.includes('immediately');
    const hasBudgetSignals = lowerMessage.includes('budget') || lowerMessage.includes('investment') || lowerMessage.includes('cost');
    const hasCompanyIndicators = lead.company && lead.company.length > 0;
    const hasDetailedMessage = lead.message.length > 50;

    if (hasUrgentKeywords) score += 25;
    if (hasBudgetSignals) score += 20;
    if (hasCompanyIndicators) score += 15;
    if (hasDetailedMessage) score += 10;

    const qualified = score >= 70;
    const leadId = `LEAD-${Date.now()}`;
    const intent = score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low';
    const urgency = hasUrgentKeywords ? 'immediate' : 'soon';
    const fit = score >= 80 ? 'excellent' : score >= 60 ? 'good' : 'poor';

    return {
      leadId,
      qualified,
      score,
      intent,
      urgency,
      fit,
      reasoning: qualified ? 'Lead shows strong buying signals and engagement' : 'Lead requires nurturing before sales engagement',
      nextAction: qualified ? 'Schedule discovery call within 24 hours' : 'Add to nurturing campaign'
    };
  };

  // Replace your existing processLead function with this one

  const processLead = async (lead: LeadData) => {
    setLoading(true);

    // Add processing message
    const processingMessage: Message = {
      id: Date.now(),
      sender: 'ai',
      text: `**🔄 Processing Lead Through n8n Workflow**

Sending lead data for: **${lead.name}** from **${lead.company}**

Live n8n workflow processing:
• Connecting to Lead Generation Bot webhook
• Running AI qualification through OpenAI
• Triggering automated actions
• Updating Google Sheets, Gmail, and Slack`,
      timestamp: new Date()
    };

    setConversationHistory(prev => [...prev, processingMessage]);

    try {
      // Call your actual n8n workflow via API
      const response = await fetch('/api/lead-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lead),
      });

      const result = await response.json();

      if (result.success) {
        const resultMessage: Message = {
          id: Date.now() + 1,
          sender: 'ai',
          text: `**✅ Lead Processed Successfully - ${result.leadId}**

**LIVE n8n Workflow Complete!**

**Lead Information:**
👤 **Name:** ${lead.name}
🏢 **Company:** ${lead.company}
📧 **Email:** ${lead.email}
📞 **Phone:** ${lead.phone || 'Not provided'}

**AI Qualification Results:**
🎯 **Score:** ${result.score || 'Calculated'}/100
📊 **Status:** ${result.qualified ? '✅ QUALIFIED LEAD' : '⚠️ NURTURING REQUIRED'}

**Real Actions Completed:**
${result.qualified ? `
✅ Lead saved to Google Sheets (Qualified Leads tab)
📧 Priority confirmation email sent to ${lead.email}
💬 Sales team notified via Slack - HIGH PRIORITY ALERT
📋 CRM updated with qualification data
🎯 **Next Action:** ${result.nextSteps}

**Response Time:** Sales team will contact within 24 hours
` : `
📊 Lead logged to nurturing database (Google Sheets)
📧 Thank you email sent to ${lead.email}
📋 Added to automated nurturing sequence
🎯 **Next Action:** ${result.nextSteps}

**Follow-up Timeline:** 3-5 business days via nurturing campaign
`}

**Workflow Confirmation:** ${result.message}

**Direct Contact:** 561-201-4365 for immediate assistance`,
          timestamp: new Date()
        };

        setConversationHistory(prev => [...prev, resultMessage]);

      } else {
        // Handle API error
        throw new Error(result.error || 'n8n workflow processing failed');
      }

    } catch (error) {
      console.error('Lead processing error:', error);

      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: `**❌ n8n Workflow Connection Error**

There was an issue connecting to our live n8n workflow:

**Error Details:** ${error.message}

**Troubleshooting:**
• Check n8n webhook is running and accessible
• Verify environment variables are configured
• Ensure n8n workflow is active

**For immediate assistance:**
📞 **Call:** 561-201-4365
✉️ **Email:** contactautomari@gmail.com

*We'll process your lead manually and get back to you within 1 hour.*

**Your Lead Info:**
• Name: ${lead.name}
• Email: ${lead.email}
• Company: ${lead.company}
• Message: ${lead.message}`,
        timestamp: new Date()
      };

      setConversationHistory(prev => [...prev, errorMessage]);
    }

    setLoading(false);
    setShowLeadForm(false);

    // Reset form
    setLeadData({
      name: '',
      email: '',
      company: '',
      message: '',
      phone: '',
      source: 'demo'
    });
  };

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

    // Simulate API processing delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));

    // Generate contextual responses based on message content
    const lowerMessage = message.toLowerCase();
    let aiResponse = '';

    if (lowerMessage.includes('lead generation') || lowerMessage.includes('leads') || lowerMessage.includes('lead gen')) {
      aiResponse = `**🎯 Lead Generation Bot Activated**

I see you're interested in lead generation! Our AI-powered Lead Generation Bot is one of our most powerful automation tools.

**What It Does:**
• Captures leads from your website automatically
• Uses AI to qualify and score each lead (0-100 scale)  
• Routes qualified leads (70+ score) directly to sales
• Sends unqualified leads to nurturing campaigns
• Integrates with Google Sheets, Gmail, and Slack

**AI Qualification Criteria:**
✓ Analyzes message for buying signals
✓ Detects urgency indicators ("urgent", "ASAP", "immediately")
✓ Identifies budget mentions and company size
✓ Scores intent level and company fit

**Business Impact:**
• 60% faster lead response time
• 40% improvement in lead quality
• 80% reduction in manual lead processing
• 300% increase in sales team efficiency

**Live Demo Available:** Want to see it in action? I can process a sample lead right now!

**Ready to test it?** Call **561-201-4365** or submit a lead below to see the AI qualification in real-time.`;

    } else if (lowerMessage.includes('submit lead') || lowerMessage.includes('test lead') || lowerMessage.includes('demo lead') || lowerMessage.includes('test the lead qualification')) {
      setShowLeadForm(true);
      aiResponse = `**📝 Lead Submission Form Activated**

Perfect! I've opened our lead capture form below. This will demonstrate our complete lead generation workflow:

**What Happens Next:**
1. **Lead Capture** - Your information is collected
2. **AI Analysis** - Our system analyzes your submission
3. **Smart Scoring** - AI assigns a qualification score (0-100)
4. **Automated Routing** - Qualified leads go to sales, others to nurturing
5. **Multi-Channel Updates** - Updates Google Sheets, sends emails, notifies Slack

**Scoring Factors:**
• Message urgency and detail level
• Company information provided
• Buying signal detection
• Contact completeness

Fill out the form below to see our AI qualification system in action! The demo will show you exactly how your leads would be processed automatically.

**💡 Pro Tip:** Try the sample leads on the left to see different AI scoring scenarios!`;

    } else if (lowerMessage.includes('customer support') || lowerMessage.includes('support')) {
      aiResponse = `**🎯 Customer Support Analysis Complete**

Based on your inquiry about customer support bottlenecks, here's what Automari can implement:

**Immediate Solutions:**
• AI-powered chatbot handling 80% of common inquiries
• Intelligent ticket routing and prioritization
• Automated response suggestions for agents
• Real-time sentiment analysis for escalations

**Expected Results:**
• 60% reduction in response time
• 40% improvement in customer satisfaction
• 70% decrease in agent workload

**Next Steps:**
Ready to transform your support workflow? Call **561-201-4365** for a custom strategy session.`;

    } else if (lowerMessage.includes('email') || lowerMessage.includes('communication')) {
      aiResponse = `**📧 Email Automation Strategy**

Your email management can be revolutionized with these Automari solutions:

**Core Features:**
• Smart email categorization and prioritization
• Automated response drafting for common inquiries
• Follow-up scheduling and reminder systems
• Integration with CRM and project management tools

**Business Impact:**
• Save 15+ hours per week on email management
• Reduce missed communications by 95%
• Improve client response times by 80%

**ROI Projection:**
For a typical business, this saves $3,200+ monthly in productivity gains.

**Ready to automate?** Contact us at **contactautomari@gmail.com** for implementation details.`;

    } else if (lowerMessage.includes('roi') || lowerMessage.includes('cost') || lowerMessage.includes('investment')) {
      aiResponse = `**💰 Automation ROI Calculator**

Here's your personalized automation investment analysis:

**Typical Business Savings:**
• Customer Support Automation: $2,500-5,000/month
• Email Management: $1,800-3,200/month  
• Scheduling Systems: $1,200-2,400/month
• Lead Generation: $3,000-6,000/month

**Implementation Investment:**
• Initial Setup: $5,000-15,000 (one-time)
• Monthly Optimization: $500-1,500

**Break-Even Timeline:** 2-4 months
**Year 1 ROI:** 300-600%

**Industry Benchmarks:**
✓ 87% of businesses see ROI within 6 months
✓ Average productivity increase: 40-60%
✓ Customer satisfaction improvement: 35-50%

**Schedule your ROI assessment:** Call **561-201-4365**`;

    } else if (lowerMessage.includes('strategy') || lowerMessage.includes('custom') || lowerMessage.includes('ai agent')) {
      aiResponse = `**🚀 Custom AI Agent Strategy**

Automari specializes in building tailored AI agents for your specific business needs:

**Discovery Process:**
1. **Business Analysis** - Deep dive into your workflows
2. **Pain Point Identification** - Map current inefficiencies  
3. **Solution Architecture** - Design custom AI agents
4. **Phased Implementation** - Roll out with minimal disruption

**Popular AI Agent Types:**
• Sales Lead Qualification Agents
• Customer Onboarding Automation
• Inventory Management Intelligence
• Financial Reporting & Analysis Bots

**Our Advantage:**
✓ 50+ successful implementations
✓ Industry-specific customization
✓ 24/7 monitoring and optimization
✓ Seamless integration with existing tools

**Next Step:** Book your strategy consultation at **561-201-4365**

*We'll analyze your business and propose 3 high-impact automation opportunities.*`;

    } else {
      // Generic intelligent response for other queries
      aiResponse = `**🤖 Automari AI Agent Response**

Thank you for your inquiry! I understand you're interested in: *"${message}"*

**How Automari Can Help:**
As South Florida's leading AI automation agency, we specialize in transforming business operations through intelligent agents and workflow automation.

**Our Expertise Areas:**
• **Lead Generation Automation** (AI-powered qualification & routing)
• Customer Support Automation (24/7 AI chatbots)
• Email & Communication Management  
• Appointment Scheduling Systems
• Inventory & Supply Chain Optimization
• Financial Process Automation

**What Makes Us Different:**
✓ Custom solutions tailored to your industry
✓ 50+ successful implementations across Florida
✓ Average ROI of 400% within first year
✓ Ongoing optimization and support

**Ready to Discuss Your Specific Needs?**
📞 **Call: 561-201-4365**
✉️ **Email: contactautomari@gmail.com**

*Let's schedule a 30-minute discovery call to identify your top automation opportunities.*`;
    }

    const aiMessage: Message = {
      id: Date.now() + 1,
      sender: 'ai',
      text: aiResponse,
      timestamp: new Date()
    };

    setLoading(false);
    setMessage('');
    setConversationHistory(prev => [...prev, aiMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickPrompts = [
    "🎯 Show me lead generation automation",
    "📝 Test the lead qualification system",
    "💰 Calculate ROI for automation",
    "🚀 Design custom AI agent strategy"
  ];

  const handleQuickPrompt = (prompt: string) => {
    setMessage(prompt);
  };

  const sampleLeads = [
    {
      name: "Sarah Johnson",
      email: "sarah@techcorp.com",
      company: "TechCorp Solutions",
      message: "We need an urgent solution for lead generation. Our current system isn't working and we have budget allocated for this quarter.",
      phone: "555-0123"
    },
    {
      name: "Mike Chen",
      email: "mike@startup.io",
      company: "StartupXYZ",
      message: "Looking into lead gen tools for our growing team.",
      phone: "555-0456"
    },
    {
      name: "Jennifer Davis",
      email: "j.davis@enterprise.com",
      company: "Enterprise Corp",
      message: "Our sales team needs better lead qualification. We're evaluating several solutions and have a significant budget for the right platform. This is a high priority project that needs to be implemented ASAP.",
      phone: "555-0789"
    }
  ];

  const fillSampleLead = (sample: any) => {
    setLeadData({
      ...sample,
      source: 'demo'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
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

                {/* Sample Leads */}
                {showLeadForm && (
                  <div className="mt-6 pt-6 border-t border-slate-600/30">
                    <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
                      <span className="text-yellow-400 mr-2">⚡</span>
                      Quick Test Leads
                    </h4>
                    <div className="space-y-2">
                      {sampleLeads.map((sample, index) => (
                        <button
                          key={index}
                          onClick={() => fillSampleLead(sample)}
                          className="w-full text-left p-2 rounded-lg bg-slate-700/30 hover:bg-slate-600/50 transition-colors text-xs"
                        >
                          <div className="font-medium text-white">{sample.name}</div>
                          <div className="text-slate-300">{sample.company}</div>
                          <div className="text-slate-400 truncate">{sample.message.substring(0, 30)}...</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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
                          className={`max-w-[80%] p-4 rounded-2xl ${msg.sender === 'user'
                            ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-br-md'
                            : 'bg-slate-700/50 text-slate-100 rounded-bl-md'
                            }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {msg.text.split('\n').map((line, i) => {
                              if (line.startsWith('**') && line.endsWith('**')) {
                                return <div key={i} className="font-bold text-yellow-400 mb-1">{line.slice(2, -2)}</div>
                              }
                              if (line.startsWith('• ')) {
                                return <div key={i} className="ml-2 mb-1">{line}</div>
                              }
                              if (line.startsWith('✓ ')) {
                                return <div key={i} className="ml-2 mb-1 text-green-300">{line}</div>
                              }
                              if (line.match(/^\d+\./)) {
                                return <div key={i} className="ml-2 mb-1 font-medium">{line}</div>
                              }
                              return <div key={i} className="mb-1">{line}</div>
                            })}
                          </p>
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

                {/* Lead Form */}
                {showLeadForm && (
                  <div className="p-4 border-t border-slate-600/50 bg-slate-900/50">
                    <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
                      <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
                        <span className="text-blue-400 mr-2">📝</span>
                        Lead Generation Demo Form
                      </h4>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <input
                          type="text"
                          placeholder="Full Name *"
                          value={leadData.name}
                          onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                          className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:border-red-500/50"
                        />
                        <input
                          type="email"
                          placeholder="Email *"
                          value={leadData.email}
                          onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                          className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:border-red-500/50"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <input
                          type="text"
                          placeholder="Company"
                          value={leadData.company}
                          onChange={(e) => setLeadData({ ...leadData, company: e.target.value })}
                          className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:border-red-500/50"
                        />
                        <input
                          type="tel"
                          placeholder="Phone"
                          value={leadData.phone}
                          onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                          className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:border-red-500/50"
                        />
                      </div>
                      <textarea
                        placeholder="Tell us about your needs (be specific for higher AI score) *"
                        value={leadData.message}
                        onChange={(e) => setLeadData({ ...leadData, message: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:border-red-500/50 resize-none"
                        rows={3}
                      />
                      <div className="flex justify-between items-center mt-3">
                        <button
                          onClick={() => setShowLeadForm(false)}
                          className="text-xs text-slate-400 hover:text-slate-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => processLead(leadData)}
                          disabled={!leadData.name || !leadData.email || !leadData.message || loading}
                          className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all"
                        >
                          🎯 Process Lead
                        </button>
                      </div>
                    </div>
                  </div>
                )}

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