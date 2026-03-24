import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import { useElectionStore } from "../store/useStore";
import { api } from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const admin = useElectionStore((state) => state.admin);
  const conductStatus = useElectionStore((state) => state.conductStatus);
  const setConductStatus = useElectionStore((state) => state.setConductStatus);
  const setAdmin = useElectionStore((state) => state.setAdmin);

  const handleConductElection = async () => {
    setConductStatus("starting");
    try {
      const response = await api.conductElection();
      setConductStatus(response.message);
    } catch {
      setConductStatus("Failed to start election. Try again.");
    }
  };

  const handleAdminSignOut = () => {
    setAdmin(null);
    setConductStatus("");
    navigate("/admin/signin");
  };

  return (
    <main className="page-shell">
      <TopBar />

      <section className="admin-dashboard-panel">
        <article className="admin-summary-card">
          <p className="dashboard-badge">Admin Dashboard</p>
          <h2>Election Operations</h2>
          <p>
            Signed in as <strong>{admin?.email}</strong>. Only verified admin users can
            trigger election actions from this page.
          </p>
          <div className="admin-controls">
            <button onClick={handleConductElection} disabled={conductStatus === "starting"}>
              {conductStatus === "starting" ? "Starting..." : "Conduct Election"}
            </button>
            <button type="button" className="secondary-btn" onClick={handleAdminSignOut}>
              Sign Out
            </button>
          </div>
          {conductStatus ? <p className="status-pill">{conductStatus}</p> : null}
        </article>
      </section>
    </main>
  );
}

export default Dashboard;