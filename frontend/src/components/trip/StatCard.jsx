const StatCard = ({ label, value }) => {
  return (
    <div className="card" style={{ textAlign: "left" }}>
      <p style={{ margin: "0 0 6px", fontSize: 13, color: "var(--color-text-muted)" }}>{label}</p>
      <p style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>{value}</p>
    </div>
  );
};

export default StatCard;
