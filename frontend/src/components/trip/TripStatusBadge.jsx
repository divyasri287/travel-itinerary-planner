const STATUS_STYLES = {
  upcoming: { bg: "#eff6ff", color: "#2563eb", label: "Upcoming" },
  ongoing: { bg: "#f0fdf4", color: "#16a34a", label: "Ongoing" },
  completed: { bg: "#f1f5f9", color: "#475569", label: "Completed" },
};

const TripStatusBadge = ({ status }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES.upcoming;

  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        backgroundColor: style.bg,
        color: style.color,
      }}
    >
      {style.label}
    </span>
  );
};

export default TripStatusBadge;
