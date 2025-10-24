import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Box,
  Typography,
  Chip,
  IconButton,
  CircularProgress,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Button,
} from "@mui/material";
import {
  Edit,
  Delete,
  Save,
  Cancel,
  CheckCircle,
  Schedule,
  Warning,
  CalendarMonth,
} from "@mui/icons-material";
import { fetchAllLeaves, updateLeave, deleteLeave } from "../services/leaveApi";

export default function LeaveList() {
  const [rows, setRows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    employeeId: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    status: "Pending",
    message: "",
    decisionComment: "",
  });
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });

  const leaveTypes = ["Sick", "Annual", "Casual", "Emergency", "Maternity", "Paternity"];

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchAllLeaves();
      setRows(res.data);
    } catch (error) {
      showAlert("Failed to load leave requests", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const showAlert = (message, severity = "success") => {
    setAlert({ open: true, message, severity });
    setTimeout(() => setAlert({ open: false, message: "", severity: "success" }), 4000);
  };

  const startEdit = (r) => {
    setEditingId(r.id);
    setForm({
      employeeId: r.employeeId || "",
      leaveType: r.leaveType || "",
      startDate: r.startDate || "",
      endDate: r.endDate || "",
      status: r.status || "Pending",
      message: r.message || "",
      decisionComment: r.decisionComment || "",
    });
  };

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const cancelEdit = () => setEditingId(null);

  const saveEdit = async () => {
    try {
      await updateLeave(editingId, form);
      setEditingId(null);
      await load();
      showAlert("Leave request updated successfully!", "success");
    } catch (error) {
      showAlert("Failed to update leave request", "error");
    }
  };

  const openDeleteDialog = (id) => {
    setDeleteDialog({ open: true, id });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, id: null });
  };

  const confirmDelete = async () => {
    try {
      await deleteLeave(deleteDialog.id);
      await load();
      showAlert("Leave request deleted successfully!", "success");
    } catch (error) {
      showAlert("Failed to delete leave request", "error");
    }
    closeDeleteDialog();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Rejected":
        return "error";
      default:
        return "warning";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle sx={{ fontSize: 16 }} />;
      case "Rejected":
        return <Warning sx={{ fontSize: 16 }} />;
      default:
        return <Schedule sx={{ fontSize: 16 }} />;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} sx={{ color: "#667eea", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading leave requests History...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: 4,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            mb: 2,
            boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
          }}
        >
          <CalendarMonth sx={{ fontSize: 40, color: "white" }} />
        </Box>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Leave Requests History
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage all my leave applications
        </Typography>
      </Box>

      {/* Alert */}
      {alert.open && (
        <Fade in>
          <Alert
            severity={alert.severity}
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
            onClose={() => setAlert({ ...alert, open: false })}
          >
            {alert.message}
          </Alert>
        </Fade>
      )}

      {/* Table Card */}
      <Fade in timeout={1000}>
        <Paper
          elevation={8}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            background: "white",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  <TableCell sx={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>
                    Employee ID
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>
                    Leave Type
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>
                    Start Date
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>
                    End Date
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>
                    Message
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>
                    Decision Comment
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "white", fontWeight: 700, fontSize: "1rem" }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((r) => (
                  <TableRow
                    key={r.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: editingId === r.id ? "transparent" : "#f9fafb",
                      },
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    {editingId === r.id ? (
                      <>
                        <TableCell>
                          <TextField
                            name="employeeId"
                            value={form.employeeId}
                            onChange={onChange}
                            size="small"
                            fullWidth
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            name="leaveType"
                            value={form.leaveType}
                            onChange={onChange}
                            select
                            size="small"
                            fullWidth
                            variant="outlined"
                          >
                            {leaveTypes.map((type) => (
                              <MenuItem key={type} value={type}>
                                {type}
                              </MenuItem>
                            ))}
                          </TextField>
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="date"
                            name="startDate"
                            value={form.startDate}
                            onChange={onChange}
                            size="small"
                            fullWidth
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="date"
                            name="endDate"
                            value={form.endDate}
                            onChange={onChange}
                            size="small"
                            fullWidth
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            name="status"
                            value={form.status}
                            onChange={onChange}
                            select
                            size="small"
                            fullWidth
                            variant="outlined"
                          >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Approved">Approved</MenuItem>
                            <MenuItem value="Rejected">Rejected</MenuItem>
                          </TextField>
                        </TableCell>

                        {/* Message (editable) */}
                        <TableCell>
                          <TextField
                            name="message"
                            value={form.message}
                            onChange={onChange}
                            size="small"
                            fullWidth
                            multiline
                            minRows={2}
                            variant="outlined"
                            placeholder="Reason / message"
                          />
                        </TableCell>

                        {/* Decision Comment (editable) */}
                        <TableCell>
                          <TextField
                            name="decisionComment"
                            value={form.decisionComment}
                            onChange={onChange}
                            size="small"
                            fullWidth
                            multiline
                            minRows={2}
                            variant="outlined"
                            placeholder="Manager/HR decision note"
                          />
                        </TableCell>

                        {/* Actions */}
                        <TableCell align="center">
                          <IconButton
                            onClick={saveEdit}
                            sx={{
                              color: "white",
                              background: "linear-gradient(135deg, #667eea, #764ba2)",
                              mr: 1,
                              "&:hover": {
                                background: "linear-gradient(135deg, #764ba2, #667eea)",
                              },
                            }}
                            size="small"
                          >
                            <Save fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={cancelEdit}
                            sx={{
                              color: "#64748b",
                              border: "1px solid #e2e8f0",
                              "&:hover": {
                                background: "#f1f5f9",
                              },
                            }}
                            size="small"
                          >
                            <Cancel fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {r.employeeId}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{r.leaveType}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {r.startDate}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {r.endDate}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(r.status)}
                            label={r.status}
                            color={getStatusColor(r.status)}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>

                        {/* Message (read-only) */}
                        <TableCell>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ whiteSpace: "pre-wrap" }}
                          >
                            {r.message || "—"}
                          </Typography>
                        </TableCell>

                        {/* Decision Comment (read-only) */}
                        <TableCell>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ whiteSpace: "pre-wrap" }}
                          >
                            {r.decisionComment || "—"}
                          </Typography>
                        </TableCell>

                        {/* Actions */}
                        <TableCell align="center">
                          <IconButton
                            onClick={() => startEdit(r)}
                            sx={{
                              color: "#667eea",
                              mr: 1,
                              "&:hover": {
                                background: "rgba(102, 126, 234, 0.1)",
                              },
                            }}
                            size="small"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => openDeleteDialog(r.id)}
                            sx={{
                              color: "#ef4444",
                              "&:hover": {
                                background: "rgba(239, 68, 68, 0.1)",
                              },
                            }}
                            size="small"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                      <CalendarMonth sx={{ fontSize: 64, color: "#cbd5e1", mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No leave requests yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Leave requests will appear here once submitted
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Fade>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#1f2937" }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this leave request? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={closeDeleteDialog}
            sx={{
              color: "#64748b",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            sx={{
              background: "#ef4444",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                background: "#dc2626",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
