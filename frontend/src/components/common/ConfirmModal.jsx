import Button from "./Button.jsx";

const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 100,
  padding: 16,
};

const modalCardStyle = {
  background: "var(--color-surface)",
  borderRadius: "var(--radius)",
  padding: 24,
  maxWidth: 380,
  width: "100%",
  boxShadow: "var(--shadow-md)",
};

const ConfirmModal = ({ title, message, confirmLabel = "Delete", isSubmitting, onConfirm, onCancel }) => {
  return (
    <div style={modalOverlayStyle} onClick={onCancel}>
      <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>{title}</h3>
        <p style={{ margin: "0 0 20px", fontSize: 14, color: "var(--color-text-muted)" }}>{message}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <button
            type="button"
            className="btn"
            style={{ backgroundColor: "var(--color-danger)", color: "#fff" }}
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
