import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchTripById } from "../services/tripService";
import TripStatusBadge from "../components/trip/TripStatusBadge.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import Loader from "../components/common/Loader.jsx";
import ItineraryTab from "../components/itinerary/ItineraryTab.jsx";
import AccommodationTab from "../components/accommodation/AccommodationTab.jsx";
import TransportationTab from "../components/transportation/TransportationTab.jsx";
import ExpenseTab from "../components/expense/ExpenseTab.jsx";
import { formatDate } from "../utils/formatDate";
import { formatCurrency } from "../utils/formatCurrency";
import { getErrorMessage } from "../utils/getErrorMessage";

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "itinerary", label: "Itinerary" },
  { value: "accommodation", label: "Accommodation" },
  { value: "transportation", label: "Transportation" },
  { value: "expenses", label: "Expenses" },
];

const DetailRow = ({ label, value }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 0",
      borderBottom: "1px solid var(--color-border)",
      gap: 16,
    }}
  >
    <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>{label}</span>
    <span style={{ fontSize: 14, fontWeight: 600, textAlign: "right" }}>{value}</span>
  </div>
);

const OverviewTab = ({ trip, setActiveTab }) => (
  <div>
    <div className="card" style={{ marginBottom: 20 }}>
      <h3 className="section-title" style={{ margin: "0 0 16px" }}>Trip Overview</h3>
      <DetailRow label="Trip Name" value={trip.tripName} />
      <DetailRow label="Destination" value={trip.destination} />
      <DetailRow label="Start Date" value={formatDate(trip.startDate)} />
      <DetailRow label="End Date" value={formatDate(trip.endDate)} />
      <DetailRow
        label="Travelers"
        value={`${trip.travelers} traveler${trip.travelers > 1 ? "s" : ""}`}
      />
      <DetailRow label="Total Budget" value={formatCurrency(trip.budget)} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14 }}>
        <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>Trip Status</span>
        <TripStatusBadge status={trip.status} />
      </div>
    </div>

    {/* Quick Links / Module jump cards */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 14,
      }}
    >
      <div
        className="quick-link-card"
        onClick={() => setActiveTab("itinerary")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setActiveTab("itinerary")}
      >
        <div className="quick-link-icon">📍</div>
        <div className="quick-link-title">Daily Itinerary</div>
        <div className="quick-link-desc">Plan day-to-day activities</div>
      </div>

      <div
        className="quick-link-card"
        onClick={() => setActiveTab("accommodation")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setActiveTab("accommodation")}
      >
        <div className="quick-link-icon">🏨</div>
        <div className="quick-link-title">Accommodations</div>
        <div className="quick-link-desc">Hotel & stay reservations</div>
      </div>

      <div
        className="quick-link-card"
        onClick={() => setActiveTab("transportation")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setActiveTab("transportation")}
      >
        <div className="quick-link-icon">✈️</div>
        <div className="quick-link-title">Transportation</div>
        <div className="quick-link-desc">Flights, trains, cabs</div>
      </div>

      <div
        className="quick-link-card"
        onClick={() => setActiveTab("expenses")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setActiveTab("expenses")}
      >
        <div className="quick-link-icon">💰</div>
        <div className="quick-link-title">Expenses</div>
        <div className="quick-link-desc">Track budget & spends</div>
      </div>
    </div>
  </div>
);

const TripDetails = () => {
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const loadTrip = async (isMountedRef = { current: true }) => {
    setIsLoading(true);
    setError("");
    setNotFound(false);
    try {
      const data = await fetchTripById(id);
      if (isMountedRef.current) setTrip(data);
    } catch (err) {
      if (!isMountedRef.current) return;
      if (err.response?.status === 404) {
        setNotFound(true);
      } else {
        setError(getErrorMessage(err, "Failed to load this trip."));
      }
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  };

  useEffect(() => {
    const isMountedRef = { current: true };
    loadTrip(isMountedRef);
    return () => {
      isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const backLink = (
    <Link to="/trips" className="btn btn-secondary" style={{ textDecoration: "none", display: "inline-flex", width: "auto" }}>
      ← Back to My Trips
    </Link>
  );

  if (isLoading) {
    return <Loader label="Loading trip details..." />;
  }

  if (notFound) {
    return (
      <div>
        <div style={{ marginBottom: 20 }}>{backLink}</div>
        <EmptyState
          title="Trip not found"
          description="This trip may have been deleted, or the link is incorrect."
          action={backLink}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div style={{ marginBottom: 20 }}>{backLink}</div>
        <ErrorState message={error} onRetry={() => loadTrip()} />
      </div>
    );
  }

  if (!trip) {
    return null;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
        {backLink}
        <Link
          to={`/trips/${trip._id}/edit`}
          className="btn btn-secondary"
          style={{ textDecoration: "none", width: "auto" }}
        >
          ✏️ Edit Trip Details
        </Link>
      </div>

      {/* Primary Trip Header Card — Travel Journal Cover Style */}
      <div className="trip-details-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 12,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.75)",
                marginBottom: 6,
              }}
            >
              Trip Details
            </div>
            <h1 className="trip-details-title">{trip.tripName}</h1>
            <p className="trip-details-destination">
              <span>📍</span> <strong>{trip.destination}</strong>
            </p>
          </div>
          <TripStatusBadge status={trip.status} />
        </div>

        {/* Clear Trip Summary Chips */}
        <div className="trip-details-chips" style={{ position: "relative", zIndex: 1 }}>
          <div className="trip-details-chip">
            <div className="trip-details-chip-label">Dates</div>
            <div className="trip-details-chip-value">
              {formatDate(trip.startDate)} → {formatDate(trip.endDate)}
            </div>
          </div>

          <div className="trip-details-chip">
            <div className="trip-details-chip-label">Travelers</div>
            <div className="trip-details-chip-value">
              {trip.travelers} traveler{trip.travelers > 1 ? "s" : ""}
            </div>
          </div>

          <div className="trip-details-chip">
            <div className="trip-details-chip-label">Budget</div>
            <div className="trip-details-chip-value">
              {formatCurrency(trip.budget)}
            </div>
          </div>

          <div className="trip-details-chip">
            <div className="trip-details-chip-label">Status</div>
            <div className="trip-details-chip-value" style={{ textTransform: "capitalize" }}>
              {trip.status}
            </div>
          </div>
        </div>
      </div>

      {/* Clear Navigation Tabs */}
      <div className="tab-bar" role="tablist" aria-label="Trip sections" style={{ marginBottom: 24 }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.value)}
              className="btn tab-pill"
              style={{
                backgroundColor: isActive ? "var(--color-primary)" : "var(--color-surface)",
                color: isActive ? "#fff" : "var(--color-text)",
                border: isActive ? "1px solid var(--color-primary)" : "1px solid var(--color-border)",
                fontWeight: isActive ? 600 : 500,
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === "overview" && <OverviewTab trip={trip} setActiveTab={setActiveTab} />}
      {activeTab === "itinerary" && <ItineraryTab tripId={trip._id} />}
      {activeTab === "accommodation" && <AccommodationTab tripId={trip._id} />}
      {activeTab === "transportation" && <TransportationTab tripId={trip._id} />}
      {activeTab === "expenses" && <ExpenseTab tripId={trip._id} tripBudget={trip.budget} />}
    </div>
  );
};

export default TripDetails;
