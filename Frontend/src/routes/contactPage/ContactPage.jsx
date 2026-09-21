import { useState } from "react";
import "./contactPage.scss";
import { toast } from "react-toastify";
import apiRequest from "../../lib/apiRequest";

const contactDetails = [
  {
    label: "Email us",
    value: "support.apnaghar@gmail.com",
    href: "mailto:support.apnaghar@gmail.com",
    icon: "✉️",
  },
  {
    label: "Call us",
    value: "+91 83445 06000",
    href: "tel:+918344506000",
    icon: "📞",
  },
];

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const message = form.message.trim();

    if (name.length < 2 || name.length > 80) {
      toast.error("Please provide your name (2-80 characters).");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (phone && !/^[+()\-\s\d]{7,20}$/.test(phone)) {
      toast.error("That phone number doesn't look right — check it and try again.");
      return;
    }

    if (message.length < 10 || message.length > 2000) {
      toast.error("Your message should be between 10 and 2000 characters.");
      return;
    }

    setIsSending(true);
    try {
      const res = await apiRequest.post("/contact", {
        name,
        email,
        phone,
        message,
      });
      toast.success(res.data.message || "Thanks for reaching out!");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "We couldn't send your message right now. Please try again later."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="contactPage container">
      <div className="section-head contactPage__head">
        <span className="section-head__eyebrow">Contact us</span>
        <h1>Get in touch</h1>
        <p className="section-head__sub">
          Property questions, listing support, or help finding the right place —
          our team is here for you.
        </p>
      </div>

      <div className="contactPage__grid">
        <div className="contactPage__info">
          {contactDetails.map((item) => {
            const body = (
              <>
                <span className="contactCard__icon">{item.icon}</span>
                <div>
                  <b>{item.label}</b>
                  <p>{item.value}</p>
                </div>
              </>
            );
            return item.href ? (
              <a className="contactCard" href={item.href} key={item.label}>
                {body}
              </a>
            ) : (
              <div className="contactCard" key={item.label}>
                {body}
              </div>
            );
          })}
        </div>

        <form className="contactForm" onSubmit={handleSubmit}>
          <h2>Send a message</h2>
          <div className="contactForm__row">
            <label className="contactForm__field">
              <span>Name</span>
              <input
                name="name"
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
              />
            </label>
            <label className="contactForm__field">
              <span>Email</span>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </label>
          </div>
          <label className="contactForm__field">
            <span>Phone (optional)</span>
            <input
              name="phone"
              type="tel"
              placeholder="+91 …"
              value={form.phone}
              onChange={handleChange}
            />
          </label>
          <label className="contactForm__field">
            <span>Message</span>
            <textarea
              name="message"
              rows={5}
              placeholder="How can we help?"
              value={form.message}
              onChange={handleChange}
            />
          </label>
          <button
            type="submit"
            className="btn btn--primary contactForm__submit"
            disabled={isSending}
          >
            {isSending ? "Sending…" : "Send message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;