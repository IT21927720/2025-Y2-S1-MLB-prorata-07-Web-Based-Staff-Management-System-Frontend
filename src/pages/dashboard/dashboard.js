import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ import the function
import "./dashboard.css";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const API_BASE = "http://localhost:8081/api/tasks";

  useEffect(() => {
    axios
      .get(API_BASE)
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Failed to fetch tasks:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      alert("Delete failed");
    }
  };

  // filter with memo
  const filteredTasks = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return tasks.filter(
      (t) =>
        (t.tname || "").toLowerCase().includes(term) ||
        (t.description || "").toLowerCase().includes(term) ||
        (t.assignTo || "").toLowerCase().includes(term) ||
        (t.status || "").toLowerCase().includes(term)
    );
  }, [tasks, searchTerm]);

  // ---------- PDF EXPORT ----------
  const handleExportPdf = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

    // Title
    const title = "Work & Schedule - Task Report";
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, 40, 40);

    // Subtitle
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const runTime = new Date().toLocaleString();
    const filterText = searchTerm ? ` | Filter: "${searchTerm}"` : "";
    doc.text(`Generated: ${runTime}${filterText}`, 40, 58);

    // rows
    const rows = filteredTasks.map((t, idx) => [
      idx + 1,
      t.tname || "-",
      t.description || "-",
      t.assignTo || "-",
      t.deadlineDate || "-",
      t.status || "-",
    ]);

    // ✅ use autoTable(doc, options) not doc.autoTable(...)
    autoTable(doc, {
      startY: 80,
      head: [["#", "Task Name", "Description", "Assigned To", "Deadline", "Status"]],
      body: rows,
      styles: {
        fontSize: 9,
        cellPadding: 6,
        valign: "middle",
      },
      headStyles: {
        fillColor: [52, 58, 64], // #343a40
        textColor: 255,
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 160 },
        2: { cellWidth: 280 },
        3: { cellWidth: 120 },
        4: { cellWidth: 120 },
        5: { cellWidth: 100 },
      },
      didDrawPage: (data) => {
        const pageSize = doc.internal.pageSize;
        const pageWidth = pageSize.getWidth();
        const pageHeight = pageSize.getHeight();

        doc.setFontSize(9);
        doc.setTextColor(120);
        doc.text("© Work Schedule System", 40, pageHeight - 20);

        const pageNumber = doc.internal.getNumberOfPages();
        doc.text(`Page ${pageNumber}`, pageWidth - 80, pageHeight - 20);
      },
    });

    doc.save("work-schedule-tasks.pdf");
  };
  // ---------- END PDF EXPORT ----------

  return (
    <div className="dash-wrap">
      <div className="dash-header">
        <h2 className="dash-title">Work & Schedule Dashboard</h2>

        <div className="dash-actions">
          <div className="dash-search">
            <input
              type="text"
              placeholder="Search by task, employee, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button className="btn btn-export" onClick={handleExportPdf}>
            ⤓ Export PDF
          </button>
        </div>
      </div>

      {loading ? (
        <p className="dash-loading">Loading...</p>
      ) : filteredTasks.length === 0 ? (
        <p className="dash-empty">No matching tasks found.</p>
      ) : (
        <div className="table-scroll">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Description</th>
                <th>Assigned To</th>
                <th>Deadline</th>
                <th>Status</th>
                <th style={{ width: 160 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((t) => (
                <tr key={t.id}>
                  <td>{t.tname}</td>
                  <td>{t.description}</td>
                  <td>{t.assignTo}</td>
                  <td>{t.deadlineDate}</td>
                  <td className="status-text">{t.status}</td>
                  <td className="actions">
                    <button
                      className="btn btn-update"
                      onClick={() => navigate(`/update/${t.id}`)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(t.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
