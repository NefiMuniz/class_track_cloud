import React from "react";
import { logOut } from "../../services/authService";
import { useNavigate } from "react-router-dom";
// import "../../styles/navbar.css";

const Navbar = ({ user, onSignOut }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logOut();
      if (onSignOut) onSignOut();
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1 className="navbar-title">ClassTrack</h1>
        </div>

        <div className="navbar-right">
          <span className="navbar-user">
            Welcome, {user?.displayName || "User"}
          </span>
          <button onClick={handleSignOut} className="btn-signout">
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
