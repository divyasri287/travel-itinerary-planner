const EmptyState = ({ title, description, action }) => {
  return (
    <div className="card" style={{ textAlign: "center", padding: "32px 20px" }}>
      <div className="empty-state-icon">🧳</div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
};

export default EmptyState;
