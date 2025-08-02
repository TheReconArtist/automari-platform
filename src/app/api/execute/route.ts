import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { message } = await request.json();

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Message is required and must be a string' },
                { status: 400 }
            );
        }

        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        // Generate contextual responses based on message content
        const lowerMessage = message.toLowerCase();
        let response = '';

        if (lowerMessage.includes('customer support') || lowerMessage.includes('support')) {
            response = `**🎯 Customer Support Analysis Complete**

Based on your inquiry about customer support bottlenecks, here's what Automari can implement:

**Immediate Solutions:**
- AI-powered chatbot handling 80% of common inquiries
- Intelligent ticket routing and prioritization
- Automated response suggestions for agents
- Real-time sentiment analysis for escalations

**Expected Results:**
- 60% reduction in response time
- 40% improvement in customer satisfaction
- 70% decrease in agent workload

**Next Steps:**
Ready to transform your support workflow? Call **561-201-4365** for a custom strategy session.`;

        } else {
            // Generic intelligent response for other queries
            response = `**🤖 Automari AI Agent Response**

Thank you for your inquiry! I understand you're interested in: *"${message}"*

**How Automari Can Help:**
As South Florida's leading AI automation agency, we specialize in transforming business operations through intelligent agents and workflow automation.

**Our Expertise Areas:**
- Customer Support Automation (24/7 AI chatbots)
- Email & Communication Management  
- Appointment Scheduling Systems
- Lead Generation & Qualification
- Inventory & Supply Chain Optimization
- Financial Process Automation

**Ready to Discuss Your Specific Needs?**
📞 **Call: 561-201-4365**
✉️ **Email: contactautomari@gmail.com**

*Let's schedule a 30-minute discovery call to identify your top automation opportunities.*`;
        }

        return NextResponse.json({ response });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error. Please try again.' },
            { status: 500 }
        );
    }
}

// Handle other HTTP methods
export async function GET() {
    return NextResponse.json(
        { message: 'Automari AI Demo API - Use POST method with message parameter' },
        { status: 405 }
    );
}