import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/common/Button.jsx";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Your account details.</p>
      </div>
      <div className="card" style={{ maxWidth: 420 }}>
        <div className="form-group">
          <div className="form-label">Name</div>
          <div style={{ fontSize: 15 }}>{user?.name}</div>
        </div>
        <div className="form-group" style={{ marginBottom: 24 }}>
          <div className="form-label">Email</div>
          <div style={{ fontSize: 15 }}>{user?.email}</div>
        </div>
        <Button variant="secondary" onClick={handleLogout} style={{ width: "auto" }}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Profile;
