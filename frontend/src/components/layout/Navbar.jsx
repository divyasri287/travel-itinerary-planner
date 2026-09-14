import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const linkClass = ({ isActive }) => `navbar-link${isActive ? " active" : ""}`;

  const userInitial = user?.name ? user.name.trim().charAt(0).toUpperCase() : "U";
  const firstName = user?.name ? user.name.split(" ")[0] : "User";

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        <span className="navbar-brand-icon">✦</span>
        Travel Planner
      </Link>

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
        <Link to="/profile" className="navbar-profile-pill" title="View Profile">
          <span className="navbar-avatar">{userInitial}</span>
          <span className="navbar-username">{firstName}</span>
        </Link>
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
