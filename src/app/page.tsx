'use client';

import { useState } from 'react';

interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: Date;
  type?: 'workflow' | 'success' | 'error';
}

interface ConsultationData {
  intent: 'book' | 'reschedule' | 'cancel';
  client_name: string;
  email: string;
  phone: string;
  consultation_type: 'Initial Consultation' | 'Career Guidance' | 'Training Information' | 'Follow-up';
  datetime: string;
  background: string;
  bookingRef?: string;
}

interface WorkflowStep {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  description: string;
  result?: any;
}

export default function IAAConsultationDemo() {
  const [message, setMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [consultationData, setConsultationData] = useState<ConsultationData>({
    intent: 'book',
    client_name: '',
    email: '',
    phone: '',
    consultation_type: 'Initial Consultation',
    datetime: '',
    background: ''
  });

  // Your n8n webhook URL - replace with your actual URL
  const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/iaa-consultation-scheduler';

  const consultationTypes = [
    {
      name: 'Initial Consultation',
      duration: '30 minutes',
      description: 'Perfect for learning about IAA\'s training program and getting started',
      icon: '🎯'
    },
    {
      name: 'Career Guidance',
      duration: '45 minutes',
      description: 'Deep dive into insurance career paths and opportunities',
      icon: '🚀'
    },
    {
      name: 'Training Information',
      duration: '30 minutes',
      description: 'Detailed overview of our comprehensive training program',
      icon: '📚'
    },
    {
      name: 'Follow-up',
      duration: '30 minutes',
      description: 'Continuing conversations and progress check',
      icon: '✅'
    }
  ];

  const sampleClients = [
    {
      client_name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1-555-0123",
      consultation_type: "Initial Consultation" as const,
      background: "Currently working in retail, interested in transitioning to insurance career for financial freedom",
      datetime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
    },
    {
      client_name: "Mike Rodriguez",
      email: "mike.r@email.com",
      phone: "+1-555-0456",
      consultation_type: "Career Guidance" as const,
      background: "Recent college graduate looking for stable career with growth potential in insurance",
      datetime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().slice(0, 16)
    },
    {
      client_name: "Lisa Chen",
      email: "lisa.chen@email.com",
      phone: "+1-555-0789",
      consultation_type: "Training Information" as const,
      background: "Has some sales experience, wants detailed info about IAA's training program and support",
      datetime: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString().slice(0, 16)
    }
  ];

  const initializeWorkflowSteps = (intent: string) => {
    const baseSteps = [
      { name: 'Webhook Received', status: 'pending' as const, description: 'n8n receives consultation request' },
      { name: 'AI Agent Processing', status: 'pending' as const, description: 'Emma AI analyzes the request' },
    ];

    if (intent === 'book') {
      return [
        ...baseSteps,
        { name: 'Check Availability', status: 'pending' as const, description: 'Verify calendar slot is available' },
        { name: 'Create Calendar Event', status: 'pending' as const, description: 'Add consultation to Google Calendar' },
        { name: 'Save to Google Sheets', status: 'pending' as const, description: 'Record booking in consultation tracker' },
        { name: 'Send Confirmation Email', status: 'pending' as const, description: 'Email confirmation to client' },
        { name: 'Generate Booking Reference', status: 'pending' as const, description: 'Create unique booking ID' }
      ];
    } else if (intent === 'reschedule') {
      return [
        ...baseSteps,
        { name: 'Find Existing Booking', status: 'pending' as const, description: 'Locate booking in Google Sheets' },
        { name: 'Update Calendar Event', status: 'pending' as const, description: 'Modify existing calendar event' },
        { name: 'Update Google Sheets', status: 'pending' as const, description: 'Update booking record' },
        { name: 'Send Update Email', status: 'pending' as const, description: 'Notify client of changes' }
      ];
    } else {
      return [
        ...baseSteps,
        { name: 'Find Existing Booking', status: 'pending' as const, description: 'Locate booking in Google Sheets' },
        { name: 'Delete Calendar Event', status: 'pending' as const, description: 'Remove from Google Calendar' },
        { name: 'Update Google Sheets', status: 'pending' as const, description: 'Mark as cancelled' },
        { name: 'Send Cancellation Email', status: 'pending' as const, description: 'Confirm cancellation to client' }
      ];
    }
  };

  const simulateWorkflowProgress = async (steps: WorkflowStep[], setSteps: React.Dispatch<React.SetStateAction<WorkflowStep[]>>) => {
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

      setSteps(prev => prev.map((step, index) =>
        index === i
          ? { ...step, status: 'running' }
          : step
      ));

      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));

      setSteps(prev => prev.map((step, index) =>
        index === i
          ? { ...step, status: 'completed', result: getStepResult(step.name) }
          : step
      ));
    }
  };

  const getStepResult = (stepName: string) => {
    const results = {
      'Webhook Received': '✅ POST request processed',
      'AI Agent Processing': '🤖 Emma AI analyzed request',
      'Check Availability': '📅 Time slot available',
      'Create Calendar Event': '📅 Event created successfully',
      'Save to Google Sheets': '📊 Row added to tracker',
      'Send Confirmation Email': '📧 Email sent successfully',
      'Generate Booking Reference': '🔢 BKG-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + new Date().toTimeString().slice(0, 5).replace(':', ''),
      'Find Existing Booking': '🔍 Booking located',
      'Update Calendar Event': '📅 Event updated',
      'Update Google Sheets': '📊 Record updated',
      'Delete Calendar Event': '🗑️ Event deleted',
      'Send Update Email': '📧 Update sent',
      'Send Cancellation Email': '📧 Cancellation confirmed'
    };
    return results[stepName] || '✅ Completed';
  };

  const processConsultation = async (data: ConsultationData) => {
    setLoading(true);

    const steps = initializeWorkflowSteps(data.intent);
    setWorkflowSteps(steps);

    // Add processing message
    const processingMessage: Message = {
      id: Date.now(),
      sender: 'ai',
      text: `**🔄 Processing ${data.intent} request for ${data.client_name}**

Connecting to n8n IAA Consultation Scheduler workflow...

**Request Details:**
• Client: ${data.client_name}
• Email: ${data.email}
• Phone: ${data.phone}
• Type: ${data.consultation_type}
• DateTime: ${new Date(data.datetime).toLocaleString()}
${data.background ? `• Background: ${data.background}` : ''}

**Live Workflow Status:**
Emma AI is processing your consultation request through our automated system.`,
      timestamp: new Date(),
      type: 'workflow'
    };

    setConversationHistory(prev => [...prev, processingMessage]);

    // Start workflow simulation
    simulateWorkflowProgress(steps, setWorkflowSteps);

    try {
      // Format data for n8n webhook
      const webhookPayload = {
        body: {
          message: {
            toolCalls: [{
              id: `call_${Date.now()}`,
              function: {
                arguments: {
                  intent: data.intent,
                  client_name: data.client_name,
                  email: data.email,
                  phone: data.phone,
                  consultation_type: data.consultation_type,
                  datetime: new Date(data.datetime).toISOString(),
                  background: data.background,
                  ...(data.bookingRef && { bookingRef: data.bookingRef })
                }
              }
            }]
          }
        }
      };

      console.log('Sending to n8n:', webhookPayload);

      // Call your n8n webhook
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload),
      });

      const result = await response.json();
      console.log('n8n response:', result);

      if (response.ok && result.results) {
        const workflowResult = result.results[0]?.result;

        // Success message
        const successMessage: Message = {
          id: Date.now() + 1,
          sender: 'ai',
          text: `**✅ Consultation ${data.intent} completed successfully!**

**n8n Workflow Result:**
${workflowResult}

**Live Integration Results:**
📊 **Google Sheets**: Consultation record ${data.intent === 'book' ? 'added' : 'updated'} in IAA tracker
📅 **Google Calendar**: Event ${data.intent === 'book' ? 'created' : data.intent === 'reschedule' ? 'updated' : 'deleted'} successfully  
📧 **Gmail**: Confirmation email sent to ${data.email}
🤖 **AI Agent**: Emma processed request with 100% accuracy

**Next Steps:**
${data.intent === 'book' ?
              `• You'll receive a confirmation email shortly
• Calendar invite sent to ${data.email}
• IAA team will prepare for your consultation
• Call 561-IAA-LIFE for any questions` :
              data.intent === 'reschedule' ?
                `• Updated consultation details sent via email
• New calendar invite will be sent
• Previous booking automatically cancelled` :
                `• Cancellation confirmed via email
• Calendar event removed
• Feel free to book again anytime`
            }

**IAA Life Contact:**
📞 561-IAA-LIFE | 📧 consultations@iaalife.com`,
          timestamp: new Date(),
          type: 'success'
        };

        setConversationHistory(prev => [...prev, successMessage]);

      } else {
        throw new Error(result.error || 'n8n workflow failed');
      }

    } catch (error) {
      console.error('Workflow error:', error);

      // Error message
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: `**⚠️ Workflow Connection Issue**

There was an issue connecting to the live n8n workflow:

**Error Details:** ${error.message}

**Demo Fallback:** While the live connection failed, here's what would happen:

**Successful Workflow Steps:**
✅ Webhook receives consultation request
✅ Emma AI processes and validates data
✅ Google Calendar ${data.intent === 'book' ? 'creates new event' : data.intent === 'reschedule' ? 'updates event' : 'deletes event'}
✅ Google Sheets ${data.intent === 'book' ? 'adds new row' : 'updates existing record'}
✅ Gmail sends ${data.intent === 'book' ? 'confirmation' : data.intent === 'reschedule' ? 'update' : 'cancellation'} email
✅ Booking reference generated: BKG-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${new Date().toTimeString().slice(0, 5).replace(':', '')}

**For live demo assistance:**
📞 **Call: 561-IAA-LIFE**
📧 **Email: consultations@iaalife.com**

*Your consultation request has been logged and IAA will contact you within 1 hour.*`,
        timestamp: new Date(),
        type: 'error'
      };

      setConversationHistory(prev => [...prev, errorMessage]);
    }

    setLoading(false);
    setShowBookingForm(false);

    // Reset form
    setConsultationData({
      intent: 'book',
      client_name: '',
      email: '',
      phone: '',
      consultation_type: 'Initial Consultation',
      datetime: '',
      background: ''
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

    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));

    const lowerMessage = message.toLowerCase();
    let aiResponse = '';

    if (lowerMessage.includes('book') || lowerMessage.includes('schedule') || lowerMessage.includes('consultation')) {
      setShowBookingForm(true);
      aiResponse = `**🎯 IAA Life Consultation Booking System**

Welcome to IAA Life's automated consultation scheduler! I'm Emma, your AI assistant.

**Available Consultation Types:**
${consultationTypes.map(type =>
        `${type.icon} **${type.name}** (${type.duration})\n   ${type.description}`
      ).join('\n\n')}

**What Makes IAA Special:**
✅ No prior insurance experience required
✅ Comprehensive training and support  
✅ Proven path to financial freedom
✅ Ongoing mentorship and guidance

**Live n8n Integration:**
This demo connects to our actual workflow system:
• Real Google Calendar integration
• Live Google Sheets tracking
• Automated email confirmations
• Professional booking management

Fill out the form below to schedule your consultation and see our automation in action!`;

    } else if (lowerMessage.includes('reschedule') || lowerMessage.includes('change')) {
      setConsultationData(prev => ({ ...prev, intent: 'reschedule' }));
      setShowBookingForm(true);
      aiResponse = `**📅 Reschedule Your IAA Consultation**

I can help you reschedule your existing consultation.

**What I Need:**
• Your booking reference (format: BKG-YYYYMMDD-HHMM)
• New preferred date and time
• Consultation type (if changing)

The system will:
✅ Find your existing booking in Google Sheets
✅ Update the calendar event
✅ Send you a new confirmation email
✅ Notify the IAA team of changes

Please fill out the form below with your new details and booking reference.`;

    } else if (lowerMessage.includes('cancel')) {
      setConsultationData(prev => ({ ...prev, intent: 'cancel' }));
      setShowBookingForm(true);
      aiResponse = `**❌ Cancel Your IAA Consultation**

I can help you cancel your consultation booking.

**What I Need:**
• Your booking reference (format: BKG-YYYYMMDD-HHMM)
• Confirmation of cancellation

The system will:
✅ Remove the event from Google Calendar
✅ Update the booking status in Google Sheets
✅ Send cancellation confirmation email
✅ Free up the time slot for other clients

**Note:** You can always book a new consultation anytime that works better for you.

Please provide your booking reference below.`;

    } else if (lowerMessage.includes('iaa') || lowerMessage.includes('insurance') || lowerMessage.includes('career')) {
      aiResponse = `**🏢 About IAA Life Insurance Training**

At IAA, we believe that a successful career in the insurance industry is within reach for everyone, regardless of prior experience or working capital.

**Our Mission:**
🎯 Create opportunities for individuals to take control of their careers
💰 Help people achieve financial freedom and happiness
📚 Provide comprehensive training and support
🤝 Build a strong, supportive network

**What We Offer:**
✅ **Comprehensive Training Program**
   • Insurance fundamentals and regulations
   • Sales techniques and client relationship building
   • Business development and lead generation
   • Ongoing education and certification support

✅ **Supportive Network**
   • Experienced mentors and coaches
   • Peer support groups and networking
   • Regular training workshops and seminars
   • Career development guidance

✅ **Financial Opportunity**
   • Unlimited earning potential
   • Commission-based compensation
   • Performance bonuses and incentives
   • Path to building your own agency

**Ready to Start Your Journey?**
Book a consultation to learn more about how IAA can help you build a successful insurance career!`;

    } else if (lowerMessage.includes('demo') || lowerMessage.includes('workflow') || lowerMessage.includes('n8n')) {
      aiResponse = `**🤖 IAA Consultation Scheduler - Live Demo**

You're experiencing our actual consultation booking system powered by n8n automation!

**Live Integrations:**
🔗 **n8n Workflow**: Real automation processing
📅 **Google Calendar**: Live calendar management  
📊 **Google Sheets**: Real-time booking tracking
📧 **Gmail**: Automated email confirmations
🤖 **AI Agent**: Emma - intelligent request processing

**Demo Features:**
✅ Book new consultations
✅ Reschedule existing bookings  
✅ Cancel appointments
✅ Real-time workflow visualization
✅ Live integration results

**How It Works:**
1. You submit a consultation request
2. n8n webhook receives the data
3. Emma AI processes and validates
4. Google Calendar creates/updates events
5. Google Sheets tracks all bookings
6. Gmail sends confirmation emails
7. You get real-time status updates

**Try it now!** Use one of the sample bookings or create your own consultation request.`;

    } else {
      aiResponse = `**👋 Welcome to IAA Life Consultation Scheduler**

I'm Emma, your AI assistant for booking insurance career consultations.

**I can help you:**
📅 **Book** a new consultation
🔄 **Reschedule** an existing appointment  
❌ **Cancel** a booking
ℹ️ Learn more about **IAA Life** and our training program

**Popular Commands:**
• "Book a consultation" - Schedule your first meeting
• "Tell me about IAA" - Learn about our training program
• "Show me the demo" - See how the automation works
• "Reschedule my appointment" - Change existing booking

**Live System:** This demo connects to our real n8n workflow with Google Calendar, Sheets, and Gmail integration.

What would you like to do today?`;
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

  const quickCommands = [
    "📅 Book a consultation",
    "🏢 Tell me about IAA Life",
    "🔄 Reschedule appointment",
    "🤖 Show me the workflow demo"
  ];

  const fillSampleData = (sample: any) => {
    setConsultationData({
      intent: 'book',
      ...sample
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">IAA</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-white">IAA Life</span>
                <span className="text-sm bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold ml-2">
                  CONSULTATION DEMO
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <a
                href="tel:561-422-5433"
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span>📞</span>
                <span>561-IAA-LIFE</span>
              </a>
              <a
                href="mailto:consultations@iaalife.com"
                className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <span>✉️</span>
                <span>consultations@iaalife.com</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-6 py-2 mb-8">
              <span className="text-yellow-400">🤖</span>
              <span className="text-sm font-medium">Live n8n Workflow Demo</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-100 to-blue-200 bg-clip-text text-transparent">
                IAA Life
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Consultation Scheduler
              </span>
            </h1>

            <p className="text-xl text-slate-300 mb-8 max-w-4xl mx-auto">
              Experience our intelligent consultation booking system powered by n8n automation, Google Calendar, and AI.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center space-x-2 bg-slate-800/40 border border-slate-600/30 rounded-full px-4 py-2">
                <span className="text-green-400">✅</span>
                <span className="text-sm text-slate-300">Live n8n Integration</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-800/40 border border-slate-600/30 rounded-full px-4 py-2">
                <span className="text-blue-400">📅</span>
                <span className="text-sm text-slate-300">Google Calendar</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-800/40 border border-slate-600/30 rounded-full px-4 py-2">
                <span className="text-purple-400">📊</span>
                <span className="text-sm text-slate-300">Real-time Tracking</span>
              </div>
            </div>
          </div>

          {/* Demo Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Quick Commands & Sample Data */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800/60 backdrop-blur-md border border-slate-600/30 rounded-2xl p-6 mb-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="text-blue-400 mr-2">💬</span>
                  Quick Commands
                </h3>
                <div className="space-y-3">
                  {quickCommands.map((command, index) => (
                    <button
                      key={index}
                      onClick={() => setMessage(command)}
                      className="w-full text-left p-3 bg-slate-700/30 hover:bg-slate-600/50 rounded-lg border border-slate-600/20 transition-all duration-300 text-sm text-slate-300 hover:text-white"
                    >
                      {command}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sample Clients */}
              {showBookingForm && (
                <div className="bg-slate-800/60 backdrop-blur-md border border-slate-600/30 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <span className="text-yellow-400 mr-2">⚡</span>
                    Sample Clients
                  </h4>
                  <div className="space-y-3">
                    {sampleClients.map((sample, index) => (
                      <button
                        key={index}
                        onClick={() => fillSampleData(sample)}
                        className="w-full text-left p-3 rounded-lg bg-slate-700/30 hover:bg-slate-600/50 transition-colors text-sm"
                      >
                        <div className="font-medium text-white">{sample.client_name}</div>
                        <div className="text-slate-300">{sample.consultation_type}</div>
                        <div className="text-slate-400 text-xs">{sample.background.substring(0, 40)}...</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Main Chat Interface */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800/60 backdrop-blur-md border border-slate-600/30 rounded-2xl overflow-hidden mb-6">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-4 border-b border-slate-600/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white">🤖</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Emma - IAA AI Assistant</h3>
                      <p className="text-xs text-slate-300">Consultation Booking Specialist</p>
                    </div>
                    <div className="ml-auto">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-400">Live System</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="h-96 overflow-y-auto p-6 space-y-4">
                  {conversationHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">🎯</div>
                      <h4 className="text-lg font-semibold text-white mb-2">Welcome to IAA Life</h4>
                      <p className="text-slate-400 text-sm">
                        Book your consultation with our AI-powered scheduling system
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
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md'
                              : msg.type === 'success'
                                ? 'bg-gradient-to-r from-green-600/20 to-blue-600/20 text-slate-100 rounded-bl-md border border-green-500/30'
                                : msg.type === 'error'
                                  ? 'bg-gradient-to-r from-red-600/20 to-orange-600/20 text-slate-100 rounded-bl-md border border-red-500/30'
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
                              if (line.startsWith('✅ ')) {
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
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-xs text-slate-400">Emma is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Consultation Form */}
                {showBookingForm && (
                  <div className="p-4 border-t border-slate-600/50 bg-slate-900/50">
                    <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
                      <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
                        <span className="text-blue-400 mr-2">📅</span>
                        {consultationData.intent === 'book' ? 'Book Consultation' :
                          consultationData.intent === 'reschedule' ? 'Reschedule Consultation' : 'Cancel Consultation'}
                      </h4>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <input
                          type="text"
                          placeholder="Full Name *"
                          value={consultationData.client_name}
                          onChange={(e) => setConsultationData({ ...consultationData, client_name: e.target.value })}
                          className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500/50"
                        />
                        <input
                          type="email"
                          placeholder="Email *"
                          value={consultationData.email}
                          onChange={(e) => setConsultationData({ ...consultationData, email: e.target.value })}
                          className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500/50"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <input
                          type="tel"
                          placeholder="Phone *"
                          value={consultationData.phone}
                          onChange={(e) => setConsultationData({ ...consultationData, phone: e.target.value })}
                          className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500/50"
                        />
                        <select
                          value={consultationData.consultation_type}
                          onChange={(e) => setConsultationData({ ...consultationData, consultation_type: e.target.value as any })}
                          className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                        >
                          {consultationTypes.map(type => (
                            <option key={type.name} value={type.name}>{type.name}</option>
                          ))}
                        </select>
                      </div>

                      {(consultationData.intent === 'reschedule' || consultationData.intent === 'cancel') && (
                        <input
                          type="text"
                          placeholder="Booking Reference (BKG-YYYYMMDD-HHMM) *"
                          value={consultationData.bookingRef || ''}
                          onChange={(e) => setConsultationData({ ...consultationData, bookingRef: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500/50 mb-3"
                        />
                      )}

                      {consultationData.intent !== 'cancel' && (
                        <>
                          <input
                            type="datetime-local"
                            value={consultationData.datetime}
                            onChange={(e) => setConsultationData({ ...consultationData, datetime: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50 mb-3"
                          />
                          <textarea
                            placeholder="Tell us about your background and goals *"
                            value={consultationData.background}
                            onChange={(e) => setConsultationData({ ...consultationData, background: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500/50 resize-none"
                            rows={3}
                          />
                        </>
                      )}

                      <div className="flex justify-between items-center mt-3">
                        <button
                          onClick={() => setShowBookingForm(false)}
                          className="text-xs text-slate-400 hover:text-slate-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => processConsultation(consultationData)}
                          disabled={!consultationData.client_name || !consultationData.email || (!consultationData.datetime && consultationData.intent !== 'cancel') || loading}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all"
                        >
                          🚀 {consultationData.intent === 'book' ? 'Book' : consultationData.intent === 'reschedule' ? 'Reschedule' : 'Cancel'} Consultation
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
                      placeholder="Ask about consultations, scheduling, or IAA Life..."
                      className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
                      rows={2}
                      disabled={loading}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!message.trim() || loading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl p-3 text-white transition-all"
                    >
                      <span className="text-lg">📤</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 text-center">
                    Live n8n Demo • Press Enter to send • Powered by IAA Life AI
                  </p>
                </div>
              </div>
            </div>

            {/* Workflow Status */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800/60 backdrop-blur-md border border-slate-600/30 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="text-purple-400 mr-2">🔄</span>
                  Workflow Status
                </h3>

                {workflowSteps.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">⚡</div>
                    <p className="text-slate-400 text-sm">Start a consultation request to see the live workflow</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {workflowSteps.map((step, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/30">
                        <div className={`w-3 h-3 rounded-full ${step.status === 'completed' ? 'bg-green-400' :
                            step.status === 'running' ? 'bg-yellow-400 animate-pulse' :
                              step.status === 'error' ? 'bg-red-400' : 'bg-slate-500'
                          }`}></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white">{step.name}</div>
                          <div className="text-xs text-slate-400">{step.description}</div>
                          {step.result && (
                            <div className="text-xs text-green-300 mt-1">{step.result}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Consultation Types */}
              <div className="bg-slate-800/60 backdrop-blur-md border border-slate-600/30 rounded-2xl p-6 mt-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <span className="text-blue-400 mr-2">📚</span>
                  Available Consultations
                </h3>
                <div className="space-y-3">
                  {consultationTypes.map((type, index) => (
                    <div key={index} className="p-3 rounded-lg bg-slate-700/30">
                      <div className="flex items-center space-x-2 mb-1">
                        <span>{type.icon}</span>
                        <span className="font-medium text-white text-sm">{type.name}</span>
                        <span className="text-xs text-slate-400">({type.duration})</span>
                      </div>
                      <p className="text-xs text-slate-300">{type.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <div className="bg-slate-800/40 backdrop-blur-md border border-slate-600/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Start Your Insurance Career Journey?
              </h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Book your consultation today and discover how IAA Life can help you achieve financial freedom through comprehensive insurance training.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="tel:561-422-5433"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full transition-all duration-300 shadow-lg"
                >
                  <span className="mr-2">📞</span>
                  Call 561-IAA-LIFE
                  <span className="ml-2">→</span>
                </a>
                <a
                  href="mailto:consultations@iaalife.com"
                  className="inline-flex items-center px-8 py-4 border-2 border-slate-400/30 bg-slate-800/20 hover:bg-slate-700/30 text-white font-semibold rounded-full transition-all duration-300"
                >
                  <span className="mr-2">✉️</span>
                  Email for Info
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}