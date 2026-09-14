const STATUS_CONFIG = {
  upcoming:  { className: "status-badge status-badge-upcoming",  label: "Upcoming" },
  ongoing:   { className: "status-badge status-badge-ongoing",   label: "Ongoing" },
  completed: { className: "status-badge status-badge-completed", label: "Completed" },
};

const TripStatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.upcoming;
  return <span className={config.className}>{config.label}</span>;
};

export default TripStatusBadge;
