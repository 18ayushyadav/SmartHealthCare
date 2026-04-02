const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"MediConnect" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
};

const appointmentConfirmationEmail = (patientName, doctorName, date, time) => `
  <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
    <h2 style="color:#0ea5e9;">MediConnect Appointment Confirmation</h2>
    <p>Dear <strong>${patientName}</strong>,</p>
    <p>Your appointment has been <strong>confirmed</strong>.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:8px;background:#f0f9ff;"><strong>Doctor</strong></td><td style="padding:8px;">Dr. ${doctorName}</td></tr>
      <tr><td style="padding:8px;background:#f0f9ff;"><strong>Date</strong></td><td style="padding:8px;">${date}</td></tr>
      <tr><td style="padding:8px;background:#f0f9ff;"><strong>Time</strong></td><td style="padding:8px;">${time}</td></tr>
    </table>
    <p style="color:#6b7280;font-size:14px;">Please arrive 10 minutes early. Bring your ID and any previous medical records.</p>
    <p style="color:#0ea5e9;font-weight:bold;">MediConnect Team</p>
  </div>
`;

module.exports = { sendEmail, appointmentConfirmationEmail };
