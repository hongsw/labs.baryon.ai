const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SCREENSHOTS_DIR = path.join(process.cwd(), 'screenshots'); // Assuming screenshots are in the root of the workspace

async function sendEmailWithScreenshots() {
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set.');
    process.exit(1);
  }

  const resend = new Resend(RESEND_API_KEY);
  const attachments = [];

  try {
    const files = fs.readdirSync(SCREENSHOTS_DIR);
    for (const file of files) {
      const filePath = path.join(SCREENSHOTS_DIR, file);
      const content = fs.readFileSync(filePath);
      attachments.push({
        filename: file,
        content: content, // Resend expects Buffer or string for content
      });
    }
  } catch (error) {
    console.warn(`Could not read screenshots from ${SCREENSHOTS_DIR}:`, error.message);
    // Continue without attachments if directory not found or empty
  }

  try {
    await resend.emails.send({
      from: 'noreply@wwwai.site',
      to: 'ai.baryon.ai@gmail.com',
      subject: 'Deployment Screenshots',
      html: 'Attached are the screenshots of the latest deployment.',
      attachments: attachments,
    });
    console.log('Email sent successfully with screenshots.');
  } catch (error) {
    console.error('Failed to send email:', error);
    process.exit(1);
  }
}

sendEmailWithScreenshots();
