import { Link } from "react-router-dom";
import TripStatusBadge from "./TripStatusBadge.jsx";
import Button from "../common/Button.jsx";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";

/**
 * `onDeleteClick` is optional so this card can be reused on the Dashboard
 * (read-only "recent trips" list) as well as on My Trips (full actions).
 */
const TripCard = ({ trip, onDeleteClick }) => {
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <Link to={`/trips/${trip._id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <h3 style={{ margin: "0 0 4px", fontSize: 16 }}>{trip.tripName}</h3>
          <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-muted)" }}>{trip.destination}</p>
        </Link>
        <TripStatusBadge status={trip.status} />
      </div>
      <div style={{ display: "flex", gap: 16, fontSize: 13, color: "var(--color-text-muted)", flexWrap: "wrap", marginBottom: onDeleteClick ? 16 : 0 }}>
        <span>
          {formatDate(trip.startDate)} → {formatDate(trip.endDate)}
        </span>
        <span>
          {trip.travelers} traveler{trip.travelers > 1 ? "s" : ""}
        </span>
        <span>{formatCurrency(trip.budget)}</span>
      </div>
      {onDeleteClick && (
        <div style={{ display: "flex", gap: 10 }}>
          <Link to={`/trips/${trip._id}/edit`} className="btn btn-secondary" style={{ textDecoration: "none" }}>
            Edit
          </Link>
          <button
            type="button"
            className="btn"
            style={{ backgroundColor: "var(--color-danger-bg)", color: "var(--color-danger)" }}
            onClick={() => onDeleteClick(trip)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default TripCard;
