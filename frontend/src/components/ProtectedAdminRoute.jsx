import { Navigate } from "react-router-dom";
import { useElectionStore } from "../store/useStore";

function ProtectedAdminRoute({ children }) {
  const admin = useElectionStore((state) => state.admin);

  if (!admin) {
    return <Navigate to="/admin/signin" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;