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

const OverviewTab = ({ trip }) => (
  <div className="card">
    <DetailRow label="Trip Name" value={trip.tripName} />
    <DetailRow label="Destination" value={trip.destination} />
    <DetailRow label="Start Date" value={formatDate(trip.startDate)} />
    <DetailRow label="End Date" value={formatDate(trip.endDate)} />
    <DetailRow
      label="Travelers"
      value={`${trip.travelers} traveler${trip.travelers > 1 ? "s" : ""}`}
    />
    <DetailRow label="Budget" value={formatCurrency(trip.budget)} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12 }}>
      <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>Status</span>
      <TripStatusBadge status={trip.status} />
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
    <Link to="/trips" className="btn btn-secondary" style={{ textDecoration: "none", display: "inline-flex" }}>
      ← Back to My Trips
    </Link>
  );

  if (isLoading) {
    return <Loader label="Loading trip..." />;
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
      <div style={{ marginBottom: 20 }}>{backLink}</div>

      <div
        className="page-header"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}
      >
        <div>
          <h1 className="page-title">{trip.tripName}</h1>
          <p className="page-subtitle">{trip.destination}</p>
        </div>
        <TripStatusBadge status={trip.status} />
      </div>

      <div className="tab-bar" role="tablist" aria-label="Trip sections">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.value}
            onClick={() => setActiveTab(tab.value)}
            className="btn tab-pill"
            style={{
              backgroundColor: activeTab === tab.value ? "var(--color-primary)" : "var(--color-surface)",
              color: activeTab === tab.value ? "#fff" : "var(--color-text)",
              border: "1px solid var(--color-border)",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && <OverviewTab trip={trip} />}
      {activeTab === "itinerary" && <ItineraryTab tripId={trip._id} />}
      {activeTab === "accommodation" && <AccommodationTab tripId={trip._id} />}
      {activeTab === "transportation" && <TransportationTab tripId={trip._id} />}
      {activeTab === "expenses" && <ExpenseTab tripId={trip._id} tripBudget={trip.budget} />}
    </div>
  );
};

export default TripDetails;
