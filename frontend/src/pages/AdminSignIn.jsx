import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import AuthCard from "../components/AuthCard";
import { useElectionStore } from "../store/useStore";
import { api } from "../services/api";

function AdminSignIn() {
  const navigate = useNavigate();
  const setAdmin = useElectionStore((state) => state.setAdmin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const admin = await api.adminSignIn({ email, password });
      setAdmin(admin);
      setMessage("Admin login successful. Redirecting to admin dashboard.");
      setTimeout(() => navigate("/admin/dashboard"), 700);
    } catch (error) {
      setMessage(error.message || "Unable to sign in as admin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <TopBar />
      <AuthCard
        title="Admin Sign In"
        subtitle="Only election administrators can perform election actions."
        onSubmit={handleSubmit}
        actionLabel="Admin Login"
        loading={loading}
      >
        <label htmlFor="adminEmail">Admin Email</label>
        <input
          id="adminEmail"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="adminPassword">Password</label>
        <input
          id="adminPassword"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </AuthCard>

      {message ? <p className="flash-message">{message}</p> : null}
    </main>
  );
}

export default AdminSignIn;