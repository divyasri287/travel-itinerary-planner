import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTrips, deleteTrip as deleteTripApi } from "../services/tripService";
import TripCard from "../components/trip/TripCard.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import Loader from "../components/common/Loader.jsx";
import ConfirmModal from "../components/common/ConfirmModal.jsx";
import Toast from "../components/common/Toast.jsx";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
];

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [tripPendingDelete, setTripPendingDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const loadTrips = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchTrips();
      setTrips(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load trips.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const filteredTrips = useMemo(() => {
    if (statusFilter === "all") return trips;
    return trips.filter((trip) => trip.status === statusFilter);
  }, [trips, statusFilter]);

  const handleConfirmDelete = async () => {
    if (!tripPendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteTripApi(tripPendingDelete._id);
      setTrips((prev) => prev.filter((t) => t._id !== tripPendingDelete._id));
      setToast({ type: "success", message: "Trip deleted successfully." });
    } catch (err) {
      setToast({
        type: "error",
        message: err.response?.data?.message || "Failed to delete trip.",
      });
    } finally {
      setIsDeleting(false);
      setTripPendingDelete(null);
    }
  };

  return (
    <div>
      <div
        className="page-header"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}
      >
        <div>
          <h1 className="page-title">My Trips</h1>
          <p className="page-subtitle">All the trips you've planned.</p>
        </div>
        <Link to="/trips/new" className="btn btn-primary" style={{ textDecoration: "none" }}>
          + Create New Trip
        </Link>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setStatusFilter(filter.value)}
            className="btn"
            style={{
              backgroundColor: statusFilter === filter.value ? "var(--color-primary)" : "var(--color-surface)",
              color: statusFilter === filter.value ? "#fff" : "var(--color-text)",
              border: "1px solid var(--color-border)",
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {isLoading && <Loader label="Loading your trips..." />}

      {!isLoading && error && <div className="alert alert-error">{error}</div>}

      {!isLoading && !error && filteredTrips.length === 0 && (
        <EmptyState
          title={trips.length === 0 ? "No trips yet" : "No trips match this filter"}
          description={
            trips.length === 0
              ? "Create your first trip to start building an itinerary."
              : "Try a different status filter, or create a new trip."
          }
          action={
            <Link to="/trips/new" className="btn btn-primary" style={{ textDecoration: "none" }}>
              + Create New Trip
            </Link>
          }
        />
      )}

      {!isLoading && !error && filteredTrips.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {filteredTrips.map((trip) => (
            <TripCard key={trip._id} trip={trip} onDeleteClick={setTripPendingDelete} />
          ))}
        </div>
      )}

      {tripPendingDelete && (
        <ConfirmModal
          title="Delete this trip?"
          message={`"${tripPendingDelete.tripName}" and all of its details will be permanently deleted. This cannot be undone.`}
          isSubmitting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setTripPendingDelete(null)}
        />
      )}

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
};

export default MyTrips;
