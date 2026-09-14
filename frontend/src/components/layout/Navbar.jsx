import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../common/Button.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) => `navbar-link${isActive ? " active" : ""}`;

  return (
    <nav className="navbar">
      <div className="navbar-brand">✈️ Travel Planner</div>
      <div className="navbar-links">
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/trips" className={linkClass}>
          My Trips
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
          Profile
        </NavLink>
      </div>
      <div className="navbar-user">
        <span>Hi, {user?.name?.split(" ")[0] || "there"}</span>
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
