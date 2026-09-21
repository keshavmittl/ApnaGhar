import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
import "./errorPage.scss";
import Logo from "../../components/logo/Logo";

function ErrorPage({ notFound = false }) {
  const routeError = useRouteError();

  let status = notFound ? 404 : null;
  let title = notFound ? "Page not found" : "Something went wrong";
  let message = notFound
    ? "The page you are looking for does not exist, or the property has been removed."
    : "We hit an unexpected problem while loading this page. Please try again.";

  if (!notFound && isRouteErrorResponse(routeError)) {
    status = routeError.status;
    if (routeError.status === 404) {
      title = "Page not found";
      message =
        "The page you are looking for does not exist, or the property has been removed.";
    } else if (routeError.statusText) {
      message = routeError.statusText;
    }
  } else if (!notFound && routeError?.message) {
    message = routeError.message;
  }

  return (
    <div className="errorPage">
      <div className="errorPage__content">
        <Logo size={56} />
        {status && <p className="errorPage__status">{status}</p>}
        <h1>{title}</h1>
        <p className="errorPage__message">{message}</p>
        <div className="errorPage__actions">
          <Link to="/" className="btn btn--primary">
            Back to home
          </Link>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;