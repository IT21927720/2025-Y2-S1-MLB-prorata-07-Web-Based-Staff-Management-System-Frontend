import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="ws-nav">
      <div className="ws-nav__inner">
        {/* Brand */}
        <Link to="/" className="ws-brand" onClick={() => setOpen(false)}>
          Work Schedule
        </Link>

        {/* Mobile toggle */}
        <button
          className="ws-toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="ws-toggle__bar" />
          <span className="ws-toggle__bar" />
          <span className="ws-toggle__bar" />
        </button>

        {/* Links */}
        <nav className={`ws-links ${open ? "is-open" : ""}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => "ws-link" + (isActive ? " active" : "")}
            onClick={() => setOpen(false)}
          >
            Dashboard
          </NavLink>

         

          {/* Right side action */}
          <Link
            to="/create"
            className="ws-cta"
            onClick={() => setOpen(false)}
            title="Create a new task"
          >
            + Create Task
          </Link>
        </nav>
      </div>
    </header>
  );
}
