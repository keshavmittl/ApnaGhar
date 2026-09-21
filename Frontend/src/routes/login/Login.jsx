import { useState, useContext } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import Logo from "../../components/logo/Logo";

function Login() {
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const validate = (username, password) => {
    const errors = {};
    if (!username) errors.username = "Username is required.";
    else if (username.length < 3) errors.username = "Username is too short.";
    else if (username.length > 20) errors.username = "Username is too long.";

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
    const password = formData.get("password").trim();

    const errors = validate(username, password);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiRequest.post("/auth/login", { username, password });
      updateUser(res.data);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
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
            वापसी का सुकून
          </p>
          <span className="ornament ornament--dark" aria-hidden="true">
            <span className="ornament__diamond" />
          </span>
          <p className="authPage__lead">
            Some feelings only a home can give — the familiar smell, the
            creaking door, the aarti by the entrance. Sign in and pick up your
            journey right where you left it.
          </p>
          <ul className="authPage__points">
            <li>✓ Saved homes and searches</li>
            <li>✓ Real-time chat with owners</li>
            <li>✓ Manage your listings easily</li>
          </ul>
        </div>
      </aside>

      <div className="authPage__formWrap">
        <form className="authForm" onSubmit={handleSubmit}>
          <h1>Sign in</h1>
          <p className="authForm__sub">Good to see you again 👋</p>

          <label className="authForm__field">
            <span>Username</span>
            <input
              name="username"
              type="text"
              placeholder="Enter your username"
              autoComplete="username"
            />
            {formErrors.username && (
              <em className="authForm__error">{formErrors.username}</em>
            )}
          </label>

          <label className="authForm__field">
            <span>Password</span>
            <div className="authForm__passwordWrapper">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
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

          <button className="btn btn--primary authForm__submit" disabled={isLoading}>
            {isLoading ? "Signing in…" : "Sign in"}
          </button>
          {error && <p className="authForm__serverError">{error}</p>}
          <p className="authForm__switch">
            Don&apos;t have an account? <Link to="/register">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;