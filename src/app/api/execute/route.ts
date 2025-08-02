import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Automari API is working!',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    const response = `**🤖 Automari AI Response**

You said: "${message}"

Contact us at 561-201-4365 for automation solutions!`;
    
    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
