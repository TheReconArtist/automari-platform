export default function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        return res.status(200).json({
            message: 'Automari AI Demo API - Use POST method with message parameter'
        });
    }

    if (req.method === 'POST') {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const response = `**🤖 Automari AI Response**
  
  You said: "${message}"
  
  As South Florida's leading AI automation agency, Automari transforms business operations through intelligent automation.
  
  **Our Services:**
  - Customer Support Automation
  - Email Management Systems
  - Appointment Scheduling
  - Lead Generation & Qualification
  
  **Contact us for automation solutions:**
  📞 Call: 561-201-4365
  ✉️ Email: contactautomari@gmail.com
  
  Ready to automate your business processes?`;

        return res.status(200).json({ response });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}