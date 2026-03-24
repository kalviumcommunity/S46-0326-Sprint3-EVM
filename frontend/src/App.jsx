import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import StudentSignIn from "./pages/StudentSignIn";
import StudentSignUp from "./pages/StudentSignUp";
import AdminSignIn from "./pages/AdminSignIn";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/student/signin" replace />} />
      <Route path="/student/signin" element={<StudentSignIn />} />
      <Route path="/student/signup" element={<StudentSignUp />} />
      <Route path="/admin/signin" element={<AdminSignIn />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedAdminRoute>
            <Dashboard />
          </ProtectedAdminRoute>
        }
      />
      <Route path="*" element={<Navigate to="/student/signin" replace />} />
    </Routes>
  );
}

export default App;