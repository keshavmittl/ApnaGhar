import axios from "axios";

// Trim any trailing slash so we do not accidentally end up with double `/api`.
const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8800";

const apiRequest = axios.create({
  baseURL: `${apiBaseUrl}/api`,
  withCredentials: true,
  timeout: 15000, // 15-second safety timeout so no request ever hangs indefinitely
});

// A rejected token should not leave the app pretending the user is still signed
// in. Clear the persisted session and bounce to the login screen, then let the
// original error keep propagating so callers can still show their own message.
apiRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      try {
        localStorage.removeItem("user");
      } catch {
        // Storage can be unavailable (private mode); nothing else to do.
      }

      const { pathname, search } = window.location;
      const isOnLogin = pathname === "/login";

      if (!isOnLogin) {
        const redirectTo = encodeURIComponent(`${pathname}${search}`);
        window.location.assign(`/login?redirectTo=${redirectTo}`);
      }
    }

    return Promise.reject(error);
  }
);

export default apiRequest;
