import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Input from "../components/common/Input.jsx";
import Button from "../components/common/Button.jsx";
import { updateUserProfile, changeUserPassword } from "../services/authService";
import { getErrorMessage } from "../utils/getErrorMessage";

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  // Profile info editing state
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Sync profileData when user loads or updates
  useEffect(() => {
    if (!isEditing && user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user, isEditing]);

  // Change password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // --- Profile Info Handlers ---
  const handleProfileChange = (e) => {
    setProfileData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (profileErrors[e.target.name]) {
      setProfileErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleCancelEdit = () => {
    setProfileData({
      name: user?.name || "",
      email: user?.email || "",
    });
    setProfileErrors({});
    setProfileError("");
    setIsEditing(false);
  };

  const validateProfile = () => {
    const errors = {};
    if (!profileData.name.trim() || profileData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }
    if (!profileData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(profileData.email.trim())) {
      errors.email = "Please enter a valid email address";
    }
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    if (!validateProfile()) return;

    setIsSavingProfile(true);
    try {
      const response = await updateUserProfile({
        name: profileData.name.trim(),
        email: profileData.email.trim(),
      });
      if (response.user) {
        updateUser(response.user);
      }
      setProfileSuccess("Profile updated successfully.");
      setIsEditing(false);
    } catch (err) {
      setProfileError(getErrorMessage(err, "Failed to update profile."));
    } finally {
      setIsSavingProfile(false);
    }
  };

  // --- Change Password Handlers ---
  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (passwordErrors[e.target.name]) {
      setPasswordErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validatePassword = () => {
    const errors = {};
    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      errors.newPassword = "New password must be at least 6 characters";
    }
    if (passwordData.confirmPassword !== passwordData.newPassword) {
      errors.confirmPassword = "New passwords do not match";
    }
    if (
      passwordData.currentPassword &&
      passwordData.newPassword &&
      passwordData.currentPassword === passwordData.newPassword
    ) {
      errors.newPassword = "New password must be different from current password";
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!validatePassword()) return;

    setIsChangingPassword(true);
    try {
      await changeUserPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });
      setPasswordSuccess("Password changed successfully.");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});
    } catch (err) {
      setPasswordError(getErrorMessage(err, "Failed to change password."));
    } finally {
      setIsChangingPassword(false);
    }
  };

  // --- Logout Handler (ONLY logout in the app) ---
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userInitial = user?.name ? user.name.trim().charAt(0).toUpperCase() : "U";

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <div className="page-header" style={{ marginBottom: 24 }}>
        <h1 className="page-title" style={{ margin: 0 }}>Profile</h1>
      </div>

      {/* User Header Card */}
      <div
        className="card"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginBottom: 24,
          padding: "22px 26px",
        }}
      >
        <div className="profile-avatar-lg">
          {userInitial}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h2
            style={{
              margin: "0 0 4px",
              fontSize: 20,
              fontWeight: 700,
              fontFamily: "var(--font-serif)",
              color: "var(--color-text)",
            }}
          >
            {user?.name}
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: "var(--color-text-muted)" }}>{user?.email}</p>
        </div>
      </div>

      {/* Section 1: Profile Information */}
      <div className="card" style={{ marginBottom: 24, padding: "26px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            paddingBottom: 14,
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div>
            <h3 className="section-title" style={{ margin: "0 0 4px", fontSize: 16 }}>
              Profile Information
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-muted)" }}>
              Update your account name and email address.
            </p>
          </div>
          {!isEditing && (
            <Button
              variant="secondary"
              onClick={() => {
                setProfileSuccess("");
                setProfileError("");
                setIsEditing(true);
              }}
              style={{ width: "auto", fontSize: 13, minHeight: 36, padding: "6px 14px" }}
            >
              Edit Profile
            </Button>
          )}
        </div>

        {profileSuccess && <div className="alert alert-success">{profileSuccess}</div>}
        {profileError && <div className="alert alert-error">{profileError}</div>}

        {!isEditing ? (
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <div className="form-label" style={{ color: "var(--color-text-muted)", fontSize: 12 }}>
                Full Name
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--color-text)" }}>
                {user?.name}
              </div>
            </div>
            <div>
              <div className="form-label" style={{ color: "var(--color-text-muted)", fontSize: 12 }}>
                Email Address
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--color-text)" }}>
                {user?.email}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} noValidate>
            <Input
              id="profile-name"
              name="name"
              label="Full Name"
              placeholder="Your full name"
              value={profileData.name}
              onChange={handleProfileChange}
              error={profileErrors.name}
            />
            <Input
              id="profile-email"
              name="email"
              type="email"
              label="Email Address"
              placeholder="Your email address"
              value={profileData.email}
              onChange={handleProfileChange}
              error={profileErrors.email}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <Button
                type="submit"
                isLoading={isSavingProfile}
                style={{ width: "auto", minHeight: 38, padding: "8px 22px" }}
              >
                Save Changes
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancelEdit}
                disabled={isSavingProfile}
                style={{ width: "auto", minHeight: 38, padding: "8px 16px" }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Section 2: Change Password */}
      <div className="card" style={{ marginBottom: 24, padding: "26px" }}>
        <div
          style={{
            marginBottom: 20,
            paddingBottom: 14,
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <h3 className="section-title" style={{ margin: "0 0 4px", fontSize: 16 }}>
            Change Password
          </h3>
          <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-muted)" }}>
            Ensure your account is using a secure password.
          </p>
        </div>

        {passwordSuccess && <div className="alert alert-success">{passwordSuccess}</div>}
        {passwordError && <div className="alert alert-error">{passwordError}</div>}

        <form onSubmit={handleSavePassword} noValidate>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            label="Current Password"
            placeholder="Enter current password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            error={passwordErrors.currentPassword}
            autoComplete="current-password"
          />
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            label="New Password"
            placeholder="At least 6 characters"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            error={passwordErrors.newPassword}
            autoComplete="new-password"
          />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm New Password"
            placeholder="Re-enter new password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            error={passwordErrors.confirmPassword}
            autoComplete="new-password"
          />
          <Button
            type="submit"
            isLoading={isChangingPassword}
            style={{ width: "auto", minHeight: 38, padding: "8px 22px", marginTop: 4 }}
          >
            Change Password
          </Button>
        </form>
      </div>

      {/* Section 3: Session / Logout — Only place in the app where logout is shown */}
      <div className="card" style={{ padding: "24px 26px", borderColor: "#fecaca" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "var(--color-text)" }}>
              Account Session
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-muted)" }}>
              Sign out of your account on this device.
            </p>
          </div>
          <button
            type="button"
            className="btn"
            onClick={handleLogout}
            style={{
              backgroundColor: "var(--color-danger-bg)",
              color: "var(--color-danger)",
              border: "1px solid #fca5a5",
              padding: "8px 24px",
              minHeight: 40,
              width: "auto",
              fontWeight: 600,
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
