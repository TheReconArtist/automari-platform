// src/pages/api/execute.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message required' });
    }

    try {
        // Call OpenAI directly (simplified)
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful AI assistant. Be concise and friendly.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: 500
            })
        });

        const data = await openaiResponse.json();

        res.status(200).json({
            response: data.choices[0].message.content,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'AI service temporarily unavailable' });
    }
}