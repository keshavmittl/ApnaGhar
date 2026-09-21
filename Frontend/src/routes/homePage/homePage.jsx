import "./homePage.scss";
import SearchBar from "../../components/searchBar/searchBar";
import { Link } from "react-router-dom";

const features = [
  {
    hindi: "हर लिस्टिंग जाँची हुई",
    title: "Verified listings",
    desc: "Every home is checked for accurate details, real photos, and honest pricing — so what you see is what you get.",
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
        <path
          d="M12 3 L20 6 V11 C20 16.2 16.6 19.8 12 21 C7.4 19.8 4 16.2 4 11 V6 Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M9 11.5 L11.2 13.7 L15.4 9"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    hindi: "सीधे मालिक से बात",
    title: "Direct owner chat",
    desc: "No brokers, no bouncers. Message the real owner, ask your questions, and talk straight — the desi way.",
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
        <path
          d="M21 12 C21 16.4 17 20 12 20 C10.8 20 9.6 19.8 8.5 19.4 L4 21 L5.4 16.9 C4.5 15.6 4 14.1 4 12.5 C4 8.1 8 4.5 12 4.5 C16 4.5 21 8.1 21 12 Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 10 H15.5 M8.5 13.5 H12.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    hindi: "साफ़-साफ़ दाम",
    title: "Honest pricing",
    desc: "Clear prices on every listing — compare homes side by side and pay securely only when you're ready.",
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
        <rect x="3" y="6" width="18" height="12" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 2.5 V4 M12 20 V21.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

const trustPoints = [
  {
    hindi: "सच्चे मालिक",
    title: "Real owners, no brokers",
    desc: "Every listing is posted by the person who owns the home.",
    icon: "🏠",
  },
  {
    hindi: "हर कदम पर जाँच",
    title: "Verified at every step",
    desc: "Details, photos and ownership are checked before they go live.",
    icon: "✓",
  },
  {
    hindi: "आपका फ़ैसला, आपका घर",
    title: "You decide, freely",
    desc: "Talk to owners, compare options, take your time. No pressure.",
    icon: "🪔",
  },
];

const cities = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Pune",
  "Hyderabad",
  "Jaipur",
  "Chennai",
  "Kolkata",
];

function HomePage() {
  return (
    <div className="homePage">
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__text">
            <p className="hero__eyebrow">
              <span className="hero__dot" aria-hidden="true" />
              Made in India · भारत में बना
            </p>
            <h1 className="hero__title hindi hindi--display">
              घर वही, जहाँ लौटने
              <br />
              की चाह हो
            </h1>
            <p className="hero__sub">
              <em>&ldquo;A home is where the heart longs to return.&rdquo;</em>
              &nbsp;Apna Ghar brings you that feeling — verified homes, real
              owners, and honest prices across India.
            </p>
            <SearchBar />
            <div className="hero__stats">
              <div className="hero__stat">
                <h2>1,200+</h2>
                <p>Homes listed</p>
              </div>
              <div className="hero__stat">
                <h2>50k+</h2>
                <p>Families moved in</p>
              </div>
              <div className="hero__stat">
                <h2>0</h2>
                <p>Broker charges</p>
              </div>
            </div>
          </div>

          <div className="hero__visual">
            <img
              src="/hero-house.svg"
              alt="Illustration of a warm Indian home with diyas, toran and rangoli"
              className="hero__art"
            />
            <div className="hero__card hero__card--price">
              <span className="hero__cardLabel">घर मिला · Home found</span>
              <b>₹ 45,00,000</b>
              <span>2 BHK · Pune</span>
            </div>
            <div className="hero__card hero__card--verified">
              <span className="hero__verifiedBadge">✓</span>
              <div>
                <b>Owner verified</b>
                <span>सीधे मालिक से बात करें</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="promise">
        <div className="container">
          <div className="promise__inner">
            <p className="promise__kicker hindi hindi--display">
              विश्वास से बना, भारत के लिए
            </p>
            <h2 className="promise__title">
              Made in India, <em>for India</em>
            </h2>
            <p className="promise__lead">
              We understand Indian families — the rishtedaar visits, the
              festivals, the feeling that a house becomes a ghar only when
              it&apos;s trusted. So we built a platform the desi way: honest,
              warm, and always on your side.
            </p>
            <div className="promise__grid">
              {trustPoints.map((point) => (
                <div className="promise__point" key={point.title}>
                  <span className="promise__icon" aria-hidden="true">
                    {point.icon}
                  </span>
                  <div>
                    <h3>{point.title}</h3>
                    <p className="promise__hindi hindi">{point.hindi}</p>
                    <p className="promise__desc">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="section-head">
            <span className="section-head__eyebrow">
              Why families trust Apna Ghar
            </span>
            <h2 className="section-head__title">
              भरोसे से शुरू होता है हर घर
            </h2>
            <p className="section-head__sub">
              <span className="hindi hindi--display features__subHindi">
                भरोसा
              </span>
              &nbsp;— trust. It is the first thing a family needs before it
              calls a place home. Here&apos;s how we earn it.
            </p>
            <span className="ornament" aria-hidden="true">
              <span className="ornament__diamond" />
            </span>
          </div>
          <div className="features__grid">
            {features.map((feature) => (
              <div className="feature" key={feature.title}>
                <span className="feature__icon">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p className="feature__hindi hindi">{feature.hindi}</p>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cities">
        <div className="container">
          <div className="section-head">
            <span className="section-head__eyebrow">शहर आपका इंतज़ार कर रहे हैं</span>
            <h2 className="section-head__title">Where will your story begin?</h2>
            <p className="section-head__sub">
              Har sheher ki apni pehchaan hoti hai — browse verified homes in
              the cities that feel like yours.
            </p>
            <span className="ornament" aria-hidden="true">
              <span className="ornament__diamond" />
            </span>
          </div>
          <div className="cities__grid">
            {cities.map((city) => (
              <Link
                key={city}
                to={`/list?city=${encodeURIComponent(city)}`}
                className="city"
              >
                <span className="city__pin">📍</span>
                <b>{city}</b>
                <span className="city__arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container cta__inner">
          <div className="cta__text">
            <p className="cta__kicker hindi hindi--display">घर बेचना है?</p>
            <h2>Have a property that deserves a loving family?</h2>
            <p>
              Apna Ghar connects real owners with real families — thousands of
              verified buyers and renters across India. Post it in minutes,
              na koi broker, na jhanjhat.
            </p>
          </div>
          <Link to="/add" className="btn btn--light cta__button">
            Post your property
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
