import "./footer.scss";
import { Link } from "react-router-dom";
import Logo from "../logo/Logo";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__tagline ">
        <span className="footer__ornament" aria-hidden="true">
          ✦
        </span>
        <p className="hindi hindi--display">
          हर घर की एक कहानी होती है — अपनी शुरू करें
        </p>
      </div>
      <div className="container footer__inner container--wide">
        <div className="footer__brand">
          <Logo tone="light" />
          <p>
            <span className="hindi hindi--display footer__deva">
              अपना घर, अपनी पहचान
            </span>
            <br />
            Made in India, for India — verified homes, real owners, and honest
            pricing. We believe a house becomes a ghar only when you can trust
            it. 🇮🇳
          </p>
        </div>

        <div className="footer__col">
          <h4>Explore</h4>
          <Link to="/list">All properties</Link>
          <Link to="/list?type=buy">Buy a home</Link>
          <Link to="/list?type=rent">Rent a home</Link>
        </div>

        <div className="footer__col">
          <h4>Company</h4>
          <Link to="/">Home</Link>
          <Link to="/contact">Contact us</Link>
          <Link to="/add">Post a property</Link>
        </div>

        <div className="footer__col">
          <h4>Get in touch</h4>
          <p className="footer__sub hindi">बात करें, कोई झिझक नहीं</p>
          <a href="mailto:support.apnaghar@gmail.com">
            support.apnaghar@gmail.com
          </a>
          <a href="tel:+918344506000">+91 83445 06000</a>
        </div>
      </div>
      <div className="footer__bottom">
        <div className="container">
          <p>
            © {new Date().getFullYear()} Apna Ghar · Made with 🧡 in India ·
            हम अपना समझते हैं
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
