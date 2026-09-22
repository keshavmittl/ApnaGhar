import nodemailer from "nodemailer";

// SMTP delivery for the contact form. The transport is created lazily so the
// API still boots on machines without mail credentials.

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "465", 10);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";

export const isMailConfigured = () => Boolean(SMTP_USER && SMTP_PASS);

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    const isGmail =
      (SMTP_HOST && SMTP_HOST.includes("gmail")) ||
      (SMTP_USER && SMTP_USER.includes("gmail"));

    // For Gmail, service: "gmail" provides the most reliable connection setup.
    // Timeouts prevent the server from hanging if cloud network firewalls drop packets.
    const transportOptions = isGmail
      ? {
          service: "gmail",
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
          },
          connectionTimeout: 5000,
          greetingTimeout: 5000,
          socketTimeout: 5000,
        }
      : {
          host: SMTP_HOST,
          port: SMTP_PORT,
          secure: SMTP_PORT === 465,
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
          },
          connectionTimeout: 5000,
          greetingTimeout: 5000,
          socketTimeout: 5000,
        };

    transporter = nodemailer.createTransport(transportOptions);
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
    from: from || `Apna Ghar Support <${SMTP_USER}>`,
    to,
    replyTo,
    subject,
    text,
    html,
  });
};
