const nodemailer = require('nodemailer');

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.hostinger.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
const SMTP_USER = process.env.SMTP_USER || 'info@houseandsky.com';
const SMTP_PASS = process.env.SMTP_PASS || 'HRX6PVTAcq;9LsJ';

const DEFAULT_ADMIN_URL = process.env.ADMIN_URL || 'https://admin.houseandsky.com';
const DEFAULT_LANDING_URL = process.env.LANDING_URL || 'https://www.houseandsky.com';

// Create Nodemailer Transporter using Hostinger SMTP
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Hostinger SMTP connection failed:', error.message);
  } else {
    console.log('✅ Hostinger SMTP Server is ready to send emails (info@houseandsky.com)');
  }
});

const getBaseUrl = (clientOrigin, role) => {
  if (clientOrigin && !clientOrigin.includes('localhost') && !clientOrigin.includes('127.0.0.1')) {
    return clientOrigin.replace(/\/$/, '');
  }
  if (role === 'PROPERTY_OWNER' || role === 'USER') {
    return DEFAULT_LANDING_URL.replace(/\/$/, '');
  }
  return DEFAULT_ADMIN_URL.replace(/\/$/, '');
};

/**
 * Send Email Verification link to User/Agent
 */
const sendVerificationEmail = async ({ toEmail, fullName, token, clientOrigin, role }) => {
  const baseUrl = getBaseUrl(clientOrigin, role);
  const verifyLink = `${baseUrl}/verify-email?token=${token}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        .header { background-color: #0B4F3C; color: #ffffff; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; font-family: Georgia, serif; letter-spacing: 0.5px; }
        .header p { margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; tracking: 2px; color: #C9A96E; font-weight: bold; }
        .body { padding: 35px 30px; color: #1a202c; line-height: 1.6; }
        .body h2 { color: #0B4F3C; margin-top: 0; font-size: 20px; }
        .btn { display: inline-block; background-color: #0B4F3C; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; margin: 20px 0; shadow: 0 4px 10px rgba(11,79,60,0.2); }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        .token-box { background: #FAF9F6; border: 1px dashed #0B4F3C; padding: 12px; font-family: monospace; font-size: 14px; word-break: break-all; border-radius: 8px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>House & Sky</h1>
          <p>Building Trust. Delivering Value.</p>
        </div>
        <div class="body">
          <h2>Verify Your Email Address</h2>
          <p>Hello <strong>${fullName || 'User'}</strong>,</p>
          <p>Thank you for registering with House & Sky. Please click the button below to verify your email address and activate your account access:</p>
          
          <div style="text-align: center;">
            <a href="${verifyLink}" target="_blank" class="btn">Verify Email Address</a>
          </div>

          <p>Or copy and paste this verification link into your browser:</p>
          <div class="token-box">${verifyLink}</div>

          <p style="font-size: 12px; color: #64748b; margin-top: 25px;">
            Note: This link will expire in 24 hours. If you did not create an account with House & Sky, please ignore this email.
          </p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} House & Sky. All rights reserved.<br/>
          Contact: info@houseandsky.com
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"House & Sky" <${SMTP_USER}>`,
    to: toEmail,
    subject: 'Action Required: Verify Your Email - House & Sky',
    html: htmlContent
  };

  return transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async ({ toEmail, fullName, token, clientOrigin, role }) => {
  const baseUrl = getBaseUrl(clientOrigin, role);
  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        .header { background-color: #0B4F3C; color: #ffffff; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; font-family: Georgia, serif; letter-spacing: 0.5px; }
        .header p { margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; tracking: 2px; color: #C9A96E; font-weight: bold; }
        .body { padding: 35px 30px; color: #1a202c; line-height: 1.6; }
        .body h2 { color: #0B4F3C; margin-top: 0; font-size: 20px; }
        .btn { display: inline-block; background-color: #0B4F3C; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; margin: 20px 0; shadow: 0 4px 10px rgba(11,79,60,0.2); }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        .token-box { background: #FAF9F6; border: 1px dashed #0B4F3C; padding: 12px; font-family: monospace; font-size: 14px; word-break: break-all; border-radius: 8px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>House & Sky</h1>
          <p>Building Trust. Delivering Value.</p>
        </div>
        <div class="body">
          <h2>Reset Your Password</h2>
          <p>Hello <strong>${fullName || 'User'}</strong>,</p>
          <p>We received a request to reset your password for your House & Sky account. Click the button below to set up a new password:</p>
          
          <div style="text-align: center;">
            <a href="${resetLink}" target="_blank" class="btn">Reset Password</a>
          </div>

          <p>Or copy and paste this link into your browser:</p>
          <div class="token-box">${resetLink}</div>

          <p style="font-size: 12px; color: #64748b; margin-top: 25px;">
            Note: This link is valid for 1 hour. If you did not request a password reset, you can safely ignore this email — your password will remain unchanged.
          </p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} House & Sky. All rights reserved.<br/>
          Contact: info@houseandsky.com
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"House & Sky" <${SMTP_USER}>`,
    to: toEmail,
    subject: 'Password Reset Request - House & Sky',
    html: htmlContent
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};
