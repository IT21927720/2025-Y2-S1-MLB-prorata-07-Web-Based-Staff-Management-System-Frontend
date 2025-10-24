// src/pages/workschedule/Updateworkschedule.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Createworkschedule.css";                 // reuse same styles
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UpdateWorkSchedule() {
  const { id } = useParams();                      // Mongo ObjectId as string
  const navigate = useNavigate();
  const API_BASE = "http://localhost:8081/api/tasks";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    Tname: "",
    Description: "",
    Assign_To: "",
    deadlineDate: "",
    status: "NEW",
  });

  // Prefill form
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/${id}`);
        // ensure date fits <input type="date">
        const dateStr =
          typeof data.deadlineDate === "string"
            ? data.deadlineDate.slice(0, 10)
            : data.deadlineDate;

        setForm({
          Tname: data.tname ?? "",
          Description: data.description ?? "",
          Assign_To: data.assignTo ?? "",
          deadlineDate: dateStr ?? "",
          status: data.status ?? "NEW",
        });
      } catch (e) {
        toast.error("Failed to load task.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Same validations as Create page
  const validate = () => {
    const { Tname, Description, Assign_To, deadlineDate, status } = form;

    if (
      !Tname.trim() ||
      !Description.trim() ||
      !Assign_To.trim() ||
      !deadlineDate ||
      !status.trim()
    ) {
      toast.error("All fields are required!");
      return false;
    }

    if (Tname.length < 3) {
      toast.error("Task name must be at least 3 characters.");
      return false;
    }

    if (Description.length < 5) {
      toast.error("Description must be at least 5 characters.");
      return false;
    }

    if (!/^EMP\d{3}$/.test(Assign_To)) {
      toast.error("Assign To must follow format: EMP + 3 digits (e.g., EMP001).");
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(deadlineDate);
    if (d < today) {
      toast.error("Deadline cannot be in the past.");
      return false;
    }

    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;            // ⛔ stop if invalid

    setSaving(true);
    try {
      const payload = {
        tname: form.Tname,
        description: form.Description,
        assignTo: form.Assign_To,
        deadlineDate: form.deadlineDate,
        status: form.status,
      };

      await axios.put(`${API_BASE}/${id}`, payload);
      toast.success("Task updated!");
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      const apiMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message;
      toast.error(`Update failed: ${apiMsg}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="task-form-wrapper">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="task-form-wrapper">
      <h2>Update Work Schedule</h2>
      <form onSubmit={onSubmit} className="task-form">
        <label>Task Name</label>
        <input
          type="text"
          name="Tname"
          value={form.Tname}
          onChange={onChange}
          placeholder="e.g., Prepare Roster"
          required
        />

        <label>Description</label>
        <input
          type="text"
          name="Description"
          value={form.Description}
          onChange={onChange}
          placeholder="e.g., Schedule for Week 1"
          required
        />

        <label>Assign To</label>
        <input
          type="text"
          name="Assign_To"
          value={form.Assign_To}
          onChange={onChange}
          placeholder="e.g., EMP001"
          required
        />

        <label>Deadline Date</label>
        <input
          type="date"
          name="deadlineDate"
          value={form.deadlineDate}
          onChange={onChange}
          required
        />

        <label>Status</label>
        <select name="status" value={form.status} onChange={onChange} required>
          <option value="NEW">NEW</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="DONE">DONE</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

        <button type="submit" disabled={saving}>
          {saving ? "Updating..." : "Update Task"}
        </button>
      </form>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}
