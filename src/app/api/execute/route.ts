import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ message: 'Automari API is working!' });
}

export async function POST(request: Request) {
    try {
        const { message } = await request.json();

        const response = `**🤖 Automari AI Response**

You said: "${message}"

As South Florida's leading AI automation agency, Automari transforms business operations through intelligent automation.

**Contact us for automation solutions:**
📞 Call: 561-201-4365
✉️ Email: contactautomari@gmail.com

Ready to automate your business processes?`;

        return NextResponse.json({ response });
    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}