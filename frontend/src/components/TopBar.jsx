import { Link, useLocation } from "react-router-dom";
import { useElectionStore } from "../store/useStore";

function TopBar() {
  const location = useLocation();
  const admin = useElectionStore((state) => state.admin);

  const navItems = admin
    ? [{ to: "/admin/dashboard", label: "Admin Dashboard" }]
    : [
        { to: "/student/signin", label: "Student Sign In" },
        { to: "/student/signup", label: "Student Sign Up" },
        { to: "/admin/signin", label: "Admin Sign In" }
      ];

  return (
    <header className="topbar">
      <div className="brand-block">
        <p className="eyebrow">Campus Election Portal</p>
        <h1>College Election Management</h1>
      </div>

      <nav className="topbar-nav" aria-label="Main navigation">
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={active ? "nav-link active" : "nav-link"}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

export default TopBar;