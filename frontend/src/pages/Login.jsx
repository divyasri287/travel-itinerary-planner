import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Input from "../components/common/Input.jsx";
import Button from "../components/common/Button.jsx";
import { getErrorMessage } from "../utils/getErrorMessage";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: location.state?.registeredEmail || "",
    password: "",
  });
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || ""
  );
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (serverError) setServerError("");
  };

  const validate = () => {
    const errors = {};
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login(formData.email.trim(), formData.password);
      navigate("/dashboard");
    } catch (error) {
      setServerError(getErrorMessage(error, "Login failed. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-icon">✦</span>
          <span>Travel Planner</span>
        </div>
        <p className="auth-subtitle">Welcome back — log in to continue planning.</p>

        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <Input
            id="email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            error={fieldErrors.email}
            autoComplete="email"
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={fieldErrors.password}
            autoComplete="current-password"
          />
          <div style={{ marginTop: 8 }}>
            <Button type="submit" isLoading={isSubmitting} style={{ minHeight: 44 }}>
              Log In
            </Button>
          </div>
        </form>

        <p className="auth-footer-text">
          Don't have an account? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
