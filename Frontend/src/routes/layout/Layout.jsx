import "./layout.scss";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import GlobalChat from "../../components/globalChat/GlobalChat";

function Layout() {
  return (
    <div className="layout">
      <Navbar />
      <div className="content">
        <Outlet />
      </div>
      <GlobalChat />
      <Footer />
    </div>
  );
}

function RequireAuth() {
  const { currentUser } = useContext(AuthContext);
  return !currentUser ? (
    <Navigate to="/login" />
  ) : (
    <div className="layout">
      <Navbar />
      <div className="content">
        <Outlet />
      </div>
      <GlobalChat />
      <Footer />
    </div>
  );
}

export { Layout, RequireAuth };