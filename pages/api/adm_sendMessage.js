
import twilio from 'twilio';

// Use environment variables for Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { message, phoneNumber, via } = req.body; // via can be 'sms' or 'whatsapp'

        try {
        // Send either SMS or WhatsApp message depending on the "via" field
        const fromNumber = via === 'whatsapp' 
            ? 'whatsapp:+14155238886' // Twilio's WhatsApp sandbox number
            : '+16016534974'; // Your Twilio phone number

        const toNumber = via === 'whatsapp'
            ? `whatsapp:${phoneNumber}` 
            : phoneNumber;

        const response = await client.messages.create({
            from: fromNumber,
            to: toNumber,
            body: message,
        });

        return res.status(200).json({ success: true, sid: response.sid });
        } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ error: 'Failed to send message' });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
