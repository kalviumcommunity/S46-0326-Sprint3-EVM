import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import TopBar from "../components/TopBar";
import AuthCard from "../components/AuthCard";
import { api } from "../services/api";
import { useElectionStore } from "../store/useStore";

function StudentSignIn() {
  const navigate = useNavigate();
  const setStudent = useElectionStore((state) => state.setStudent);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const user = await api.studentSignIn({ email, password });
      setStudent(user);
      setMessage("Student login successful.");
      setTimeout(() => navigate("/dashboard"), 700);
    } catch (error) {
      setMessage(error.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <TopBar />
      <AuthCard
        title="Student Sign In"
        subtitle="Enter your registered credentials to continue."
        onSubmit={handleSubmit}
        actionLabel="Sign In"
        loading={loading}
        footer={
          <p>
            New user? <Link to="/student/signup">Create account</Link>
          </p>
        }
      >
        <label htmlFor="studentEmail">Email</label>
        <input
          id="studentEmail"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="studentPassword">Password</label>
        <input
          id="studentPassword"
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

export default StudentSignIn;