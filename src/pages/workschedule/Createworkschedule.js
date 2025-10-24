import { useState } from "react";
import { useNavigate } from "react-router-dom";   // ✅ import navigate hook
import axios from "axios";
import "./Createworkschedule.css";
import { toast, ToastContainer } from "react-toastify";


export default function CreateWorkSchedule() {
  const [form, setForm] = useState({
    Tname: "",
    Description: "",
    Assign_To: "",
    deadlineDate: "",
    status: "NEW",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ init navigate

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // ✅ validations
  const validate = () => {
    const { Tname, Description, Assign_To, deadlineDate, status } = form;

    if (
      !Tname.trim() ||
      !Description.trim() ||
      !Assign_To.trim() ||
      !deadlineDate.trim() ||
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

    // ✅ Only EMP + 3 digits
    if (!/^EMP\d{3}$/.test(Assign_To)) {
      toast.error("Assign To must follow format: EMP + 3 digits (e.g., EMP001).");
      return false;
    }

    const today = new Date();
    const deadline = new Date(deadlineDate);
    today.setHours(0, 0, 0, 0);
    if (deadline < today) {
      toast.error("Deadline cannot be in the past.");
      return false;
    }

    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        tname: form.Tname,
        description: form.Description,
        assignTo: form.Assign_To,
        deadlineDate: form.deadlineDate,
        status: form.status,
      };

      const { data } = await axios.post("http://localhost:8081/api/tasks", payload);

      toast.success(`Task Created Successfully!`);

      // ✅ redirect to dashboard after short delay
      setTimeout(() => {
        navigate("/"); // assuming "/" shows your Dashboard
      }, 1500);

      setForm({
        Tname: "",
        Description: "",
        Assign_To: "",
        deadlineDate: "",
        status: "NEW",
      });
    } catch (err) {
      const apiMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message;
      toast.error(`Failed: ${apiMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-wrapper">
      <h2>Create Work Schedule</h2>
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
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Task"}
        </button>
      </form>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}
