/**
 * Generic modal shell used to host forms (e.g. add/edit itinerary item).
 * For simple confirm/cancel dialogs, use ConfirmModal instead.
 */
const Modal = ({ title, onClose, children }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="btn btn-secondary modal-close-btn"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
