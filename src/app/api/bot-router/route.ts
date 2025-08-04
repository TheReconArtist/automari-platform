import { NextRequest, NextResponse } from 'next/server';

interface LeadData {
    name: string;
    email: string;
    company: string;
    message: string;
    phone?: string;
    source: string;
}

interface N8nLeadResponse {
    success: boolean;
    message: string;
    leadId: string;
    qualified: boolean;
    nextSteps: string;
    score?: number;
}

export async function POST(request: NextRequest) {
    try {
        const leadData: LeadData = await request.json();

        // Validate required fields
        if (!leadData.name || !leadData.email || !leadData.message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required' },
                { status: 400 }
            );
        }

        console.log('Processing lead:', leadData.name, leadData.email);

        // Prepare data for n8n webhook (matches your workflow structure)
        const n8nPayload = {
            name: leadData.name,
            email: leadData.email,
            company: leadData.company || 'Not provided',
            message: leadData.message,
            phone: leadData.phone || '',
            source: leadData.source || 'automari-demo',
            timestamp: new Date().toISOString(),
            userAgent: request.headers.get('user-agent') || '',
            ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        };

        console.log('Sending to n8n webhook:', process.env.N8N_BASE_URL);

        // Call your actual n8n webhook
        const n8nResponse = await fetch(`${process.env.N8N_BASE_URL}/webhook/lead-capture`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add authentication if your n8n webhook requires it
                ...(process.env.N8N_WEBHOOK_SECRET && {
                    'Authorization': `Bearer ${process.env.N8N_WEBHOOK_SECRET}`
                }),
            },
            body: JSON.stringify(n8nPayload),
        });

        console.log('n8n Response status:', n8nResponse.status);

        if (!n8nResponse.ok) {
            const errorText = await n8nResponse.text();
            console.error('n8n webhook error:', errorText);
            throw new Error(`n8n webhook failed: ${n8nResponse.status} - ${errorText}`);
        }

        const result: N8nLeadResponse = await n8nResponse.json();

        console.log('n8n result:', result);

        // Log successful lead processing
        console.log(`Lead processed successfully: ${result.leadId}, Qualified: ${result.qualified}`);

        // Return the result from n8n
        return NextResponse.json({
            success: true,
            leadId: result.leadId,
            message: result.message,
            qualified: result.qualified,
            nextSteps: result.nextSteps,
            score: result.score,
        });

    } catch (error) {
        console.error('Lead generation API error:', error);

        // Return detailed error in development, generic in production
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to process lead through n8n workflow. Please try again.',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined,
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}

// Health check endpoint
export async function GET() {
    return NextResponse.json({
        status: 'ok',
        service: 'lead-generation-api',
        n8nConfigured: !!process.env.N8N_BASE_URL,
        timestamp: new Date().toISOString()
    });
}