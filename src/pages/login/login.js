import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../service/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.email.trim() || !form.password.trim()) {
      toast.error("Email and password are required.");
      return false;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!emailOk) {
      toast.error("Invalid email format.");
      return false;
    }

    // ✅ Only HR or Manager emails allowed
    const allowed = form.email.toLowerCase().includes("hr") || form.email.toLowerCase().includes("manager");
    if (!allowed) {
      toast.error("Access restricted — only HR or Manager accounts can log in.");
      return false;
    }

    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // ✅ Check users created via Signup (stored in localStorage)
      const usersRaw = localStorage.getItem("ws_users");
      const users = usersRaw ? JSON.parse(usersRaw) : [];

      const emailLC = form.email.toLowerCase();
      const found = users.find((u) => u.email === emailLC);

      if (found && found.password === form.password) {
        // Successful login
        login({ email: found.email, name: found.name }, null);
        toast.success("Login successful!");
        setTimeout(() => navigate("/"), 700);
        return;
      }

      // ❌ Wrong credentials
      toast.error("Invalid email or password.");
    } catch (err) {
      toast.error(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ws-login-wrap">
      <form className="ws-login-card" onSubmit={onSubmit}>
        <h2>HR / Manager Login</h2>

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="e.g., hr@company.com or manager@company.com"
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          placeholder="••••••••"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="ws-login-alt">
          No account? <span onClick={() => navigate("/signup")}>Sign up</span>
        </p>
      </form>

      <ToastContainer position="top-center" autoClose={1600} />
    </div>
  );
}
