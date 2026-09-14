import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Input from "../components/common/Input.jsx";
import Button from "../components/common/Button.jsx";
import { getErrorMessage } from "../utils/getErrorMessage";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errors.email = "Enter a valid email address";
    }
    if (!formData.password || formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = "Passwords do not match";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register(formData.name.trim(), formData.email.trim(), formData.password);
      navigate("/login", {
        state: {
          successMessage: "Registration successful. Please login to continue.",
          registeredEmail: formData.email.trim(),
        },
      });
    } catch (error) {
      setServerError(getErrorMessage(error, "Registration failed. Please try again."));
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
        <p className="auth-subtitle">Create an account to start your travel journal.</p>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <Input
            id="name"
            name="name"
            type="text"
            label="Full Name"
            placeholder="Jane Doe"
            value={formData.name}
            onChange={handleChange}
            error={fieldErrors.name}
            autoComplete="name"
          />
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
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={handleChange}
            error={fieldErrors.password}
            autoComplete="new-password"
          />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={fieldErrors.confirmPassword}
            autoComplete="new-password"
          />
          <div style={{ marginTop: 8 }}>
            <Button type="submit" isLoading={isSubmitting} style={{ minHeight: 44 }}>
              Create Account
            </Button>
          </div>
        </form>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
