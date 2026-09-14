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

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

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

  const greeting = getGreeting();
  const userName = user?.name || "Traveler";

  return (
    <div>
      {/* Header & Greeting */}
      <div
        className="dashboard-greeting"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <div className="dashboard-greeting-time">{greeting}</div>
          <h1 className="dashboard-greeting-name">{userName}</h1>
          <p className="dashboard-greeting-sub">Plan your next journey.</p>
        </div>
        <Link
          to="/trips/new"
          className="btn btn-primary"
          style={{ textDecoration: "none", width: "auto", minHeight: 42, padding: "10px 22px" }}
        >
          + Create New Trip
        </Link>
      </div>

      {isLoading && (
        <>
          <div style={{ marginBottom: 28 }}>
            <SkeletonGrid count={5} minWidth={170} cardClassName="skeleton skeleton-stat-card" />
          </div>
          <SkeletonGrid count={3} minWidth={280} cardClassName="skeleton skeleton-trip-card" />
        </>
      )}

      {!isLoading && error && <ErrorState message={error} onRetry={loadSummary} />}

      {!isLoading && !error && summary && (
        <>
          {/* Trip Summary Stats */}
          <div style={{ marginBottom: 36 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.8,
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                marginBottom: 12,
              }}
            >
              Trip Summary
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                gap: 16,
              }}
            >
              <StatCard label="Total Trips" value={summary.totalTrips} />
              <StatCard label="Upcoming Trips" value={summary.upcomingTrips} />
              <StatCard label="Ongoing Trips" value={summary.ongoingTrips ?? 0} />
              <StatCard label="Completed Trips" value={summary.completedTrips} />
              <StatCard label="Total Planned Budget" value={formatCurrency(summary.totalBudget)} />
            </div>
          </div>

          {/* Recent & Upcoming Trips */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h2 className="section-title" style={{ margin: 0 }}>
                Recent & Upcoming Trips
              </h2>
              <Link
                to="/trips"
                style={{
                  fontSize: 13,
                  color: "var(--color-primary)",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                View All Trips →
              </Link>
            </div>

            {summary.recentTrips.length === 0 ? (
              <EmptyState
                title="No trips yet"
                description="Start planning your next journey."
              />
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 18,
                }}
              >
                {summary.recentTrips.map((trip) => (
                  <TripCard key={trip._id} trip={trip} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
