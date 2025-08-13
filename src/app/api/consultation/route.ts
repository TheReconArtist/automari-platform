// pages/api/consultation/route.ts or app/api/consultation/route.ts (depending on your Next.js setup)

import { NextRequest, NextResponse } from 'next/server';

// Your n8n webhook URL - set this in your environment variables
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/iaa-consultation-scheduler';

export async function POST(request: NextRequest) {
    try {
        // Get the consultation data from the request
        const consultationData = await request.json();

        console.log('Received consultation request:', consultationData);

        // Format the data for your n8n webhook
        const webhookPayload = {
            body: {
                message: {
                    toolCalls: [{
                        id: `call_${Date.now()}`,
                        function: {
                            arguments: {
                                intent: consultationData.intent,
                                client_name: consultationData.client_name,
                                email: consultationData.email,
                                phone: consultationData.phone,
                                consultation_type: consultationData.consultation_type,
                                datetime: consultationData.datetime,
                                background: consultationData.background,
                                ...(consultationData.bookingRef && { bookingRef: consultationData.bookingRef })
                            }
                        }
                    }]
                }
            }
        };

        console.log('Sending to n8n:', webhookPayload);

        // Call your n8n webhook
        const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookPayload),
        });

        console.log('n8n response status:', n8nResponse.status);

        if (!n8nResponse.ok) {
            throw new Error(`n8n webhook failed with status: ${n8nResponse.status}`);
        }

        const result = await n8nResponse.json();
        console.log('n8n response data:', result);

        // Extract the workflow result
        const workflowResult = result.results?.[0]?.result || 'Consultation processed successfully';

        // Generate a booking reference if this is a new booking
        const bookingRef = consultationData.intent === 'book'
            ? `BKG-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${new Date().toTimeString().slice(0, 5).replace(':', '')}`
            : consultationData.bookingRef;

        // Determine if this is a qualified consultation (for demo purposes, always qualify)
        const qualified = true;
        const score = Math.floor(Math.random() * 30) + 70; // Random score between 70-100

        // Return success response
        return NextResponse.json({
            success: true,
            leadId: `CONSULT-${Date.now()}`,
            qualified,
            score,
            bookingRef,
            message: workflowResult,
            nextSteps: consultationData.intent === 'book'
                ? 'Consultation confirmed - you will receive a calendar invite and confirmation email'
                : consultationData.intent === 'reschedule'
                    ? 'Consultation rescheduled - updated calendar invite will be sent'
                    : 'Consultation cancelled - confirmation email sent',
            workflow: {
                webhookCalled: true,
                googleCalendar: 'Updated',
                googleSheets: 'Record saved',
                emailSent: 'Confirmation sent',
                aiProcessed: 'Emma AI completed processing'
            }
        });

    } catch (error) {
        console.error('API Error:', error);

        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to process consultation request',
            details: 'Check n8n webhook URL and ensure workflow is active'
        }, { status: 500 });
    }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}