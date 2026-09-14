import { useEffect } from "react";

const toastWrapStyle = {
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
    <div className="toast-wrap" style={toastWrapStyle} role="status" aria-live="polite">
      <div
        className={`alert toast-enter ${type === "success" ? "alert-success" : "alert-error"}`}
        style={{ margin: 0, boxShadow: "var(--shadow-md)", justifyContent: "flex-start" }}
      >
        <span className="toast-icon" aria-hidden="true">
          {type === "success" ? "✅" : "⚠️"}
        </span>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
