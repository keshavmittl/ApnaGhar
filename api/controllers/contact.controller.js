import { isMailConfigured, sendContactEmail } from "../lib/mailer.js";

const NAME_MIN = 2;
const NAME_MAX = 80;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 2000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Tolerates "+91 98765 43210", "9876543210", "(022) 1234 5678", etc.
const PHONE_REGEX = /^[+()\-\s\d]{7,20}$/;

const RECIPIENT = process.env.CONTACT_TO || "support.apnaghar@gmail.com";

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const validatePayload = ({ name, email, phone, message }) => {
  const clean = {
    name: typeof name === "string" ? name.trim() : "",
    email: typeof email === "string" ? email.trim().toLowerCase() : "",
    phone: typeof phone === "string" ? phone.trim() : "",
    message: typeof message === "string" ? message.trim() : "",
  };

  if (clean.name.length < NAME_MIN || clean.name.length > NAME_MAX) {
    return {
      error: `Please provide your name (${NAME_MIN}-${NAME_MAX} characters).`,
    };
  }

  if (!EMAIL_REGEX.test(clean.email)) {
    return { error: "Please provide a valid email address." };
  }

  if (clean.phone && !PHONE_REGEX.test(clean.phone)) {
    return { error: "That phone number doesn't look right — check it and try again." };
  }

  if (clean.message.length < MESSAGE_MIN || clean.message.length > MESSAGE_MAX) {
    return {
      error: `Your message should be between ${MESSAGE_MIN} and ${MESSAGE_MAX} characters.`,
    };
  }

  return { data: clean };
};

export const submitContact = async (req, res) => {
  const { error, data } = validatePayload(req.body || {});

  if (error) {
    return res.status(400).json({ message: error });
  }

  if (!isMailConfigured()) {
    return res.status(503).json({
      message:
        "Contact form delivery isn't configured yet. Please try again later.",
    });
  }

  const { name, email, phone, message } = data;
  const subject = `[Apna Ghar] New message from ${name}`;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : "Phone: —",
    "",
    "Message:",
    message,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#503A26;margin-bottom:4px">New contact form message</h2>
      <p style="color:#8c7a63;margin-top:0">Sent via the Apna Ghar website</p>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        <tr>
          <td style="padding:8px 0;color:#574733;width:90px"><b>Name</b></td>
          <td style="padding:8px 0">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#574733"><b>Email</b></td>
          <td style="padding:8px 0">${escapeHtml(email)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#574733"><b>Phone</b></td>
          <td style="padding:8px 0">${escapeHtml(phone || "—")}</td>
        </tr>
      </table>
      <div style="background:#fbf2e2;border:1px solid #e3d2b4;border-radius:8px;padding:16px;margin-top:8px">
        ${escapeHtml(message).replaceAll("\n", "<br/>")}
      </div>
    </div>
  `;

  try {
    await sendContactEmail({
      to: RECIPIENT,
      replyTo: email,
      subject,
      text,
      html,
    });
    res.status(200).json({
      message: "Thanks for reaching out! We'll get back to you within 24 hours.",
    });
  } catch (error) {
    console.error("Contact email failed to send:", error);
    res.status(500).json({
      message: "We couldn't deliver your message right now. Please try again later.",
    });
  }
};
