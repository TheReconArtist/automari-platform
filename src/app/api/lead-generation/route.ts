import { NextRequest, NextResponse } from 'next/server';

interface LeadData {
    name: string;
    email: string;
    company: string;
    message: string;
    phone?: string;
    source: string;
}

export async function POST(request: NextRequest) {
    try {
        const leadData: LeadData = await request.json();

        if (!leadData.name || !leadData.email || !leadData.message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required' },
                { status: 400 }
            );
        }

        // Call your n8n webhook
        const n8nResponse = await fetch(`${process.env.N8N_BASE_URL}/webhook/lead-capture`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(process.env.N8N_WEBHOOK_SECRET && {
                    'Authorization': `Bearer ${process.env.N8N_WEBHOOK_SECRET}`
                }),
            },
            body: JSON.stringify({
                ...leadData,
                timestamp: new Date().toISOString(),
            }),
        });

        if (!n8nResponse.ok) {
            throw new Error(`n8n webhook failed: ${n8nResponse.status}`);
        }

        const result = await n8nResponse.json();

        return NextResponse.json({
            success: true,
            leadId: result.leadId,
            message: result.message,
            qualified: result.qualified,
            nextSteps: result.nextSteps,
            score: result.score,
        });

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to process lead through n8n workflow.',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        service: 'lead-generation-api',
        n8nConfigured: !!process.env.N8N_BASE_URL,
        timestamp: new Date().toISOString()
    });
}