import { useState } from "react";
import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import Logo from "../../components/logo/Logo";

function Register() {
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validate = (username, email, password) => {
    const errors = {};

    if (!username) errors.username = "Username is required.";
    else if (username.length < 3) errors.username = "Username is too short.";
    else if (username.length > 20) errors.username = "Username is too long.";

    if (!email) errors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email))
      errors.email = "Invalid email format.";

    if (!password) errors.password = "Password is required.";
    else if (password.length < 6)
      errors.password = "Password must be at least 6 characters.";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFormErrors({});
    setIsLoading(true);

    const formData = new FormData(e.target);
    const username = formData.get("username").trim();
    const email = formData.get("email").trim();
    const password = formData.get("password").trim();

    const errors = validate(username, email, password);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      await apiRequest.post("/auth/register", {
        username,
        email,
        password,
      });
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="authPage">
      <aside className="authPage__brand">
        <Logo tone="light" />
        <div className="authPage__brandBody">
          <p className="authPage__eyebrow hindi">अपना घर · अपनी पहचान</p>
          <p className="authPage__deva hindi hindi--display">
            नई शुरुआत का पता
          </p>
          <span className="ornament ornament--dark" aria-hidden="true">
            <span className="ornament__diamond" />
          </span>
          <p className="authPage__lead">
            Har family ki apni kahani hoti hai — and every story needs an
            address. Join families across India who found theirs here.
          </p>
          <ul className="authPage__points">
            <li>✓ Free to join, forever</li>
            <li>✓ Verified homes across India</li>
            <li>✓ Direct owner chat, no brokers</li>
          </ul>
        </div>
      </aside>

      <div className="authPage__formWrap">
        <form className="authForm" onSubmit={handleSubmit}>
          <h1>Create your account</h1>
          <p className="authForm__sub">It only takes a minute ✨</p>

          <label className="authForm__field">
            <span>Username</span>
            <input
              name="username"
              type="text"
              placeholder="Choose a username"
              autoComplete="username"
            />
            {formErrors.username && (
              <em className="authForm__error">{formErrors.username}</em>
            )}
          </label>

          <label className="authForm__field">
            <span>Email</span>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
            />
            {formErrors.email && (
              <em className="authForm__error">{formErrors.email}</em>
            )}
          </label>

          <label className="authForm__field">
            <span>Password</span>
            <div className="authForm__passwordWrapper">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                autoComplete="new-password"
              />
              <button 
                type="button" 
                className="authForm__eyeBtn" 
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
            {formErrors.password && (
              <em className="authForm__error">{formErrors.password}</em>
            )}
          </label>

          <button
            className="btn btn--primary authForm__submit"
            disabled={isLoading}
          >
            {isLoading ? "Creating account…" : "Create account"}
          </button>
          {error && <p className="authForm__serverError">{error}</p>}
          <p className="authForm__switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;