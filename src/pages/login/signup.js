import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const { name, email, password, confirmPassword } = form;
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.error("All fields are required."); return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error("Invalid email."); return false; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters."); return false; }
    if (password !== confirmPassword) { toast.error("Passwords do not match."); return false; }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const usersRaw = localStorage.getItem("ws_users");
      const users = usersRaw ? JSON.parse(usersRaw) : [];

      const emailLC = form.email.toLowerCase();
      if (users.some(u => u.email === emailLC)) {
        toast.error("Email already registered.");
        setLoading(false);
        return;
      }

      users.push({ name: form.name.trim(), email: emailLC, password: form.password });
      localStorage.setItem("ws_users", JSON.stringify(users));

      toast.success("Signup successful! Please login.");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      toast.error(err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ws-login-wrap">
      <form className="ws-login-card" onSubmit={onSubmit}>
        <h2>Create account</h2>

        <label>Name</label>
        <input name="name" value={form.name} onChange={onChange} placeholder="Your name" />

        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={onChange} placeholder="you@example.com" />

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={onChange} placeholder="••••••••" />

        <label>Confirm Password</label>
        <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={onChange} placeholder="••••••••" />

        <button type="submit" disabled={loading}>{loading ? "Creating..." : "Sign up"}</button>

        <p className="ws-login-alt">Have an account? <span onClick={() => navigate("/login")}>Login</span></p>
      </form>
      <ToastContainer position="top-center" autoClose={1600} />
    </div>
  );
}
