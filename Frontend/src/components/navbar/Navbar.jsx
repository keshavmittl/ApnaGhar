import { useContext, useEffect, useState } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { useNotificationStore } from "../../lib/notificationStore";
import Logo from "../logo/Logo";
import ThemeToggle from "../themeToggle/ThemeToggle";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const number = useNotificationStore((state) => state.number);
  const fetch = useNotificationStore((state) => state.fetch);

  useEffect(() => {
    // Notifications only matter once we know who is signed in.
    if (currentUser) {
      fetch();
    }
  }, [currentUser, fetch]);

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <div className="navbar__left">
          <Link to="/" className="navbar__logo" onClick={() => setOpen(false)}>
            <Logo />
          </Link>
          <div className="navbar__links">
            <Link to="/">Home</Link>
            <Link to="/list">Explore</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        <div className="navbar__right">
          <ThemeToggle />
          {currentUser ? (
            <div className="navbar__user">
              <Link to="/profile" className="navbar__profile" title="Profile">
                <img
                  src={currentUser.avatar || "/noavatar.jpg"}
                  alt={`${currentUser.username}'s avatar`}
                  className="navbar__avatar"
                />
                {number > 0 && (
                  <span className="navbar__badge">{number}</span>
                )}
                <span className="navbar__username">{currentUser.username}</span>
              </Link>
              <Link to="/add" className="btn btn--accent navbar__cta">
                + Post Property
              </Link>
            </div>
          ) : (
            <div className="navbar__auth">
              <Link to="/login" className="navbar__signin">
                Sign in
              </Link>
              <Link to="/register" className="btn btn--primary navbar__cta">
                Get Started
              </Link>
            </div>
          )}

          <button
            type="button"
            className={`navbar__burger ${open ? "is-open" : ""}`}
            aria-label="Toggle menu"
            onClick={() => setOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className={`navbar__drawer ${open ? "is-open" : ""}`}>
          <Link to="/" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link to="/list" onClick={() => setOpen(false)}>
            Explore
          </Link>
          <Link to="/contact" onClick={() => setOpen(false)}>
            Contact
          </Link>
          {currentUser ? (
            <>
              <Link to="/profile" onClick={() => setOpen(false)}>
                Profile
              </Link>
              <Link to="/add" onClick={() => setOpen(false)}>
                Post Property
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>
                Sign in
              </Link>
              <Link to="/register" onClick={() => setOpen(false)}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;