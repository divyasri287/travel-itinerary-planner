const EmptyState = ({ title, description, action }) => {
  return (
    <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
      <div className="empty-state-icon">🧳</div>
      <h3 style={{ margin: "0 0 6px", fontSize: 16 }}>{title}</h3>
      {description && (
        <p style={{ margin: "0 0 16px", color: "var(--color-text-muted)", fontSize: 14, maxWidth: 360, marginLeft: "auto", marginRight: "auto" }}>
          {description}
        </p>
      )}
      {action}
    </div>
  );
};

export default EmptyState;
