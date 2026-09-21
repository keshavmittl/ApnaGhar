import nodemailer from "nodemailer";

// SMTP delivery for the contact form. The transport is created lazily so the
// API still boots on machines without mail credentials (same pattern as the
// lazy Razorpay client). Configure SMTP_* vars in api/.env to enable sending.

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "465", 10);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";

export const isMailConfigured = () => Boolean(SMTP_USER && SMTP_PASS);

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // true for 465, false for 587/25 (STARTTLS)
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }
  return transporter;
};

/**
 * Deliver a contact-form message.
 * Returns a promise that resolves with the nodemailer info object.
 */
export const sendContactEmail = async ({ to, from, replyTo, subject, text, html }) => {
  const transport = getTransporter();
  return transport.sendMail({
    from: from || SMTP_USER,
    to,
    replyTo,
    subject,
    text,
    html,
  });
};
