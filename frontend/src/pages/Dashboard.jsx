import { useAuth } from "../hooks/useAuth";

/**
 * Phase 1 placeholder: confirms the authenticated shell (Navbar + protected
 * routing) works end-to-end. The real stat cards, budget totals and recent
 * trips list are wired up in Phase 3 once the Trip model/API exist.
 */
const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Welcome, {user?.name}!</h1>
        <p className="page-subtitle">
          Your trip dashboard will appear here once trips are added in Phase 3.
        </p>
      </div>
      <div className="card">
        <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: 14 }}>
          Authentication is fully working. Trip stats, upcoming trips, and the
          "Create New Trip" flow will be built in the next phase.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
