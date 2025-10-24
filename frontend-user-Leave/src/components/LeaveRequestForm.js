import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import {
  CalendarMonth,
  Person,
  Description,
  DateRange,
  CheckCircle
} from "@mui/icons-material";

export default function LeaveRequestForm() {
 const [leaveData, setLeaveData] = useState({
  employeeId: "",
  leaveType: "",
  startDate: "",
  endDate: "",
  message: "",   // <-- added message field
  status: "Pending",
});


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const leaveTypes = [
    { value: "Sick", label: "Sick " },
    { value: "Annual", label: "Annual Leave" },
    { value: "Casual", label: "Casual Leave" },
    { value: "Emergency", label: "Emergency Leave" },
    { value: "Maternity", label: "Maternity Leave" },
    { value: "Paternity", label: "Paternity Leave" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeaveData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Submitting:", leaveData);
    
    try {
      const res = await fetch("http://localhost:8080/api/leave/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leaveData)
      });
      const data = await res.json();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
      alert("Leave applied. ID: " + data.id);
      setLeaveData({ employeeId: "", leaveType: "", startDate: "", endDate: "", message: "", status: "Pending" });
    } catch (err) {
      console.error(err);
      alert("Failed to apply leave");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
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
            boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
            mb: 2,
          }}
        >
          <CalendarMonth sx={{ fontSize: 40, color: "white" }} />
        </Box>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Apply for Leave
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Submit your time-off application
        </Typography>
      </Box>

      {/* Form Card */}
      <Paper elevation={8} sx={{ borderRadius: 4, p: 4 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Employee ID */}
          <TextField
            fullWidth
            label="Employee ID"
            name="employeeId"
            value={leaveData.employeeId}
            onChange={handleChange}
            required
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: "#667eea" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover fieldset": {
                  borderColor: "#667eea",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#667eea",
                },
              },
            }}
          />

          {/* Leave Type */}
          <TextField
            fullWidth
            select
            label="Leave Type"
            name="leaveType"
            value={leaveData.leaveType}
            onChange={handleChange}
            required
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Description sx={{ color: "#764ba2" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover fieldset": {
                  borderColor: "#764ba2",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#764ba2",
                },
              },
            }}
          >
            {leaveTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Date Range */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              fullWidth
              label="Start Date"
              name="startDate"
              type="date"
              value={leaveData.startDate}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DateRange sx={{ color: "#f093fb" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#f093fb",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#f093fb",
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="End Date"
              name="endDate"
              type="date"
              value={leaveData.endDate}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DateRange sx={{ color: "#f093fb" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#f093fb",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#f093fb",
                  },
                },
              }}
            />
          </Box>
          
          {/* Message (Reason for Leave) */}
<TextField
  fullWidth
  multiline
  minRows={3}
  label="Reason / Message"
  name="message"
  value={leaveData.message}
  onChange={handleChange}
  required
  variant="outlined"
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <Description sx={{ color: "#667eea" }} />
      </InputAdornment>
    ),
  }}
  sx={{
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      "&:hover fieldset": {
        borderColor: "#667eea",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#667eea",
      },
    },
  }}
/>


          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{
              py: 1.5,
              borderRadius: 2,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              fontSize: "1.1rem",
              fontWeight: 700,
              textTransform: "none",
              boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 12px 32px rgba(102, 126, 234, 0.5)",
              },
              "&:disabled": {
                background: "#ccc",
              },
            }}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={24} sx={{ color: "white", mr: 1 }} />
                Submitting...
              </>
            ) : (
              "Submit Leave Request"
            )}
          </Button>
        </Box>
      </Paper>

      {/* Success Alert */}
      {showSuccess && (
        <Alert
          icon={<CheckCircle fontSize="inherit" />}
          severity="success"
          sx={{
            mt: 3,
            borderRadius: 2,
            fontSize: "1rem",
            boxShadow: "0 8px 24px rgba(76, 175, 80, 0.3)",
          }}
        >
          <Typography variant="body1" fontWeight={600}>
            Success! Your leave request has been submitted
          </Typography>
        </Alert>
      )}
    </Box>
  );
}