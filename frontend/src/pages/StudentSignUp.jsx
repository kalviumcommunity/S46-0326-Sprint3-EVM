import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import TopBar from "../components/TopBar";
import AuthCard from "../components/AuthCard";
import { api } from "../services/api";

function StudentSignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    studentId: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const updateField = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.studentSignUp(form);
      setMessage("Student registration completed.");
      setTimeout(() => navigate("/student/signin"), 900);
    } catch (error) {
      setMessage(error.message || "Unable to register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <TopBar />
      <AuthCard
        title="Student Sign Up"
        subtitle="Create a student account to access election services."
        onSubmit={handleSubmit}
        actionLabel="Create Account"
        loading={loading}
        footer={
          <p>
            Already have an account? <Link to="/student/signin">Sign in</Link>
          </p>
        }
      >
        <label htmlFor="studentName">Full Name</label>
        <input
          id="studentName"
          type="text"
          value={form.fullName}
          onChange={(event) => updateField("fullName", event.target.value)}
          required
        />

        <label htmlFor="studentId">Student ID</label>
        <input
          id="studentId"
          type="text"
          value={form.studentId}
          onChange={(event) => updateField("studentId", event.target.value)}
          required
        />

        <label htmlFor="studentRegEmail">Email</label>
        <input
          id="studentRegEmail"
          type="email"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          required
        />

        <label htmlFor="studentRegPassword">Password</label>
        <input
          id="studentRegPassword"
          type="password"
          value={form.password}
          onChange={(event) => updateField("password", event.target.value)}
          required
        />
      </AuthCard>

      {message ? <p className="flash-message">{message}</p> : null}
    </main>
  );
}

export default StudentSignUp;