import Button from "./Button.jsx";

const ConfirmModal = ({ title, message, confirmLabel = "Delete", isSubmitting, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>{title}</h3>
        <p style={{ margin: "0 0 20px", fontSize: 14, color: "var(--color-text-muted)" }}>{message}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting} style={{ width: "auto" }}>
            Cancel
          </Button>
          <button
            type="button"
            className="btn"
            style={{ backgroundColor: "var(--color-danger)", color: "#fff", width: "auto" }}
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
