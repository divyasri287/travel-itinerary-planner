import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../common/Button.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
    navigate("/login");
  };

  const closeMenu = () => setIsMenuOpen(false);

  const linkClass = ({ isActive }) => `navbar-link${isActive ? " active" : ""}`;

  return (
    <nav className="navbar">
      <div className="navbar-brand">✈️ Travel Planner</div>

      <button
        type="button"
        className={`navbar-menu-btn${isMenuOpen ? " is-open" : ""}`}
        onClick={() => setIsMenuOpen((prev) => !prev)}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMenuOpen}
      >
        <span />
      </button>

      <div className="navbar-user">
        <span>Hi, {user?.name?.split(" ")[0] || "there"}</span>
        <Button variant="secondary" onClick={handleLogout} style={{ width: "auto" }}>
          Logout
        </Button>
      </div>

      <div className={`navbar-links${isMenuOpen ? " is-open" : ""}`}>
        <NavLink to="/dashboard" className={linkClass} onClick={closeMenu}>
          Dashboard
        </NavLink>
        <NavLink to="/trips" className={linkClass} onClick={closeMenu}>
          My Trips
        </NavLink>
        <NavLink to="/profile" className={linkClass} onClick={closeMenu}>
          Profile
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
