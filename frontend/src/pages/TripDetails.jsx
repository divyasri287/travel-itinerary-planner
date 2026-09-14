import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchTripById } from "../services/tripService";
import TripStatusBadge from "../components/trip/TripStatusBadge.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import Loader from "../components/common/Loader.jsx";
import { formatDate } from "../utils/formatDate";
import { formatCurrency } from "../utils/formatCurrency";

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "itinerary", label: "Itinerary" },
  { value: "accommodation", label: "Accommodation" },
  { value: "transportation", label: "Transportation" },
  { value: "expenses", label: "Expenses" },
];

const ComingSoonTab = ({ label }) => (
  <EmptyState
    title="Coming in a later phase"
    description={`${label} will be available here once this section is built.`}
  />
);

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

  useEffect(() => {
    let isMounted = true;

    const loadTrip = async () => {
      setIsLoading(true);
      setError("");
      setNotFound(false);
      try {
        const data = await fetchTripById(id);
        if (isMounted) setTrip(data);
      } catch (err) {
        if (!isMounted) return;
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(err.response?.data?.message || "Failed to load this trip.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadTrip();
    return () => {
      isMounted = false;
    };
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
        <div className="alert alert-error">{error}</div>
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

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className="btn"
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
      {activeTab !== "overview" && (
        <ComingSoonTab label={TABS.find((tab) => tab.value === activeTab)?.label} />
      )}
    </div>
  );
};

export default TripDetails;
