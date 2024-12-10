import multer from 'multer';
import nodemailer from 'nodemailer';
import { promisify } from 'util';

// Initialize multer for file uploads
const upload = multer({ dest: '/tmp' });

// Convert Multer callback to a Promise-based function
const uploadSingle = promisify(upload.single('file'));

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parser so Multer can process it
  },
};

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Process the file upload with Multer
    await uploadSingle(req, res);

    const { to, subject, text } = req.body;
    const file = req.file;

    // Nodemailer configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'prasannakm13@gmail.com', // Sender's email
        pass: 'xeip srcf igvk vpcw', // App-specific password or email password
      },
    });

    // Create email options with or without an attachment
    const mailOptions = {
      from: 'prasannakm13@gmail.com',
      to,
      subject,
      text,
      attachments: file
        ? [
            {
              filename: file.originalname,
              path: file.path, // Use the path instead of buffer
            },
          ]
        : [],
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Send success response
    return res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error occurred:', error);
    return res.status(500).json({ message: 'Failed to send email or process file.' });
  }
};

export default handler;
