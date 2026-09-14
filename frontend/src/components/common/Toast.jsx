import { useEffect } from "react";

const toastStyle = {
  position: "fixed",
  bottom: 24,
  right: 24,
  zIndex: 200,
  minWidth: 240,
  maxWidth: 360,
};

/**
 * Simple self-dismissing toast. Renders nothing if `message` is falsy.
 * `type` is "success" or "error" and maps to the existing .alert classes.
 */
const Toast = ({ message, type = "success", onClose, duration = 3500 }) => {
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div style={toastStyle}>
      <div className={`alert ${type === "success" ? "alert-success" : "alert-error"}`} style={{ margin: 0, boxShadow: "var(--shadow-md)" }}>
        {message}
      </div>
    </div>
  );
};

export default Toast;
