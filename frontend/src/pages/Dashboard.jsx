import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { fetchDashboardSummary } from "../services/tripService";
import StatCard from "../components/trip/StatCard.jsx";
import TripCard from "../components/trip/TripCard.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import { SkeletonGrid } from "../components/common/Skeleton.jsx";
import { formatCurrency } from "../utils/formatCurrency";
import { getErrorMessage } from "../utils/getErrorMessage";

const Dashboard = () => {
  const { user } = useAuth();

  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSummary = async ({ isMounted = { current: true } } = {}) => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchDashboardSummary();
      if (isMounted.current) setSummary(data);
    } catch (err) {
      if (isMounted.current) setError(getErrorMessage(err, "Failed to load dashboard data."));
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  };

  useEffect(() => {
    const isMounted = { current: true };
    loadSummary({ isMounted });
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="page-title">Welcome, {user?.name}!</h1>
          <p className="page-subtitle">Here's a snapshot of your travel plans.</p>
        </div>
        <Link to="/trips/new" className="btn btn-primary" style={{ textDecoration: "none", width: "auto" }}>
          + Create New Trip
        </Link>
      </div>

      {isLoading && (
        <>
          <div style={{ marginBottom: 28 }}>
            <SkeletonGrid count={4} minWidth={180} cardClassName="skeleton skeleton-stat-card" />
          </div>
          <SkeletonGrid count={3} minWidth={260} cardClassName="skeleton skeleton-trip-card" />
        </>
      )}

      {!isLoading && error && <ErrorState message={error} onRetry={loadSummary} />}

      {!isLoading && !error && summary && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 16,
              marginBottom: 28,
            }}
          >
            <StatCard label="Total Trips" value={summary.totalTrips} />
            <StatCard label="Upcoming Trips" value={summary.upcomingTrips} />
            <StatCard label="Completed Trips" value={summary.completedTrips} />
            <StatCard label="Total Planned Budget" value={formatCurrency(summary.totalBudget)} />
          </div>

          <h2 style={{ fontSize: 16, marginBottom: 12 }}>Recent & Upcoming Trips</h2>

          {summary.recentTrips.length === 0 ? (
            <EmptyState
              title="No trips yet"
              description="Create your first trip to start planning your itinerary."
              action={
                <Link to="/trips/new" className="btn btn-primary" style={{ textDecoration: "none", width: "auto" }}>
                  + Create New Trip
                </Link>
              }
            />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              {summary.recentTrips.map((trip) => (
                <TripCard key={trip._id} trip={trip} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
