import { Link } from "react-router-dom";
import TripStatusBadge from "./TripStatusBadge.jsx";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";

/**
 * `onDeleteClick` is optional — allows reuse on Dashboard (read-only)
 * and My Trips (with Edit/Delete actions).
 */
const TripCard = ({ trip, onDeleteClick }) => {
  return (
    <div className="trip-card">
      {/* Decorative gradient header band */}
      <div className="trip-card-header" />

      <div className="trip-card-body">
        {/* Title row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
          <h3 className="trip-card-title">{trip.tripName}</h3>
          <TripStatusBadge status={trip.status} />
        </div>

        {/* Destination */}
        <p className="trip-card-destination">
          <span>📍</span> {trip.destination}
        </p>

        {/* Meta */}
        <div className="trip-card-meta">
          <span>🗓 {formatDate(trip.startDate)} — {formatDate(trip.endDate)}</span>
          <span>👥 {trip.travelers} traveler{trip.travelers > 1 ? "s" : ""}</span>
          <span>💰 {formatCurrency(trip.budget)}</span>
        </div>

        {/* Footer actions */}
        <div className="trip-card-footer">
          <Link
            to={`/trips/${trip._id}`}
            className="btn btn-primary"
            style={{ textDecoration: "none", fontSize: 13, minHeight: 34, padding: "6px 16px", width: "auto" }}
          >
            View Trip Details
          </Link>

          {onDeleteClick && (
            <>
              <Link
                to={`/trips/${trip._id}/edit`}
                className="btn btn-secondary"
                style={{ textDecoration: "none", fontSize: 13, minHeight: 34, padding: "6px 12px", width: "auto" }}
              >
                Edit
              </Link>
              <button
                type="button"
                className="btn"
                style={{
                  fontSize: 13,
                  minHeight: 34,
                  padding: "6px 12px",
                  backgroundColor: "var(--color-danger-bg)",
                  color: "var(--color-danger)",
                  border: "1px solid #fecaca",
                  width: "auto",
                }}
                onClick={() => onDeleteClick(trip)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripCard;
