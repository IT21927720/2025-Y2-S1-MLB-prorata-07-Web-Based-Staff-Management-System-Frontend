// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Chip,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Card,
//   CardContent,
//   Grid,
//   Avatar,
//   Divider,
//   Alert,
//   Fade,
//   IconButton,
//   Tab,
//   Tabs,
// } from "@mui/material";
// import {
//   CheckCircle,
//   Cancel,
//   Schedule,
//   CalendarMonth,
//   DateRange,
//   Description,
//   Close,
//   Search,
// } from "@mui/icons-material";

// export default function AdminLeaveApproval() {
//   const [leaves, setLeaves] = useState([]);
//   const [filteredLeaves, setFilteredLeaves] = useState([]);
//   const [selectedLeave, setSelectedLeave] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [actionType, setActionType] = useState(""); // "approve" | "reject"
//   const [comment, setComment] = useState("");
//   const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterTab, setFilterTab] = useState(0);
//   const [stats, setStats] = useState({
//     pending: 0,
//     approved: 0,
//     rejected: 0,
//     total: 0,
//   });

//   // Fetch all leaves
//   const fetchLeaves = async () => {
//     try {
//       const res = await fetch("http://localhost:8080/api/leave/all");
//       const data = await res.json();
//       setLeaves(data);
//       setFilteredLeaves(data);
//       calculateStats(data);
//     } catch (error) {
//       showAlert("Failed to load leave requests", "error");
//     }
//   };

//   useEffect(() => {
//     fetchLeaves();
//   }, []);

//   // Calculate statistics
//   const calculateStats = (data) => {
//     setStats({
//       pending: data.filter((l) => l.status === "Pending").length,
//       approved: data.filter((l) => l.status === "Approved").length,
//       rejected: data.filter((l) => l.status === "Rejected").length,
//       total: data.length,
//     });
//   };

//   // Filter leaves based on tab and search
//   useEffect(() => {
//     let filtered = leaves;

//     if (filterTab === 1) filtered = leaves.filter((l) => l.status === "Pending");
//     if (filterTab === 2) filtered = leaves.filter((l) => l.status === "Approved");
//     if (filterTab === 3) filtered = leaves.filter((l) => l.status === "Rejected");

//     if (searchTerm) {
//       filtered = filtered.filter(
//         (l) =>
//           l.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           l.leaveType?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     setFilteredLeaves(filtered);
//   }, [filterTab, searchTerm, leaves]);

//   const showAlert = (message, severity = "success") => {
//     setAlert({ open: true, message, severity });
//     setTimeout(() => setAlert({ open: false, message: "", severity: "success" }), 4000);
//   };

//   const handleOpenDialog = (leave, action) => {
//     setSelectedLeave(leave);
//     setActionType(action); // "approve" or "reject"
//     setComment("");
//     setDialogOpen(true);
//   };

//   const handleCloseDialog = () => {
//     setDialogOpen(false);
//     setComment("");
//     setSelectedLeave(null);
//   };

//   // ✅ Confirm decision (sets status + decisionComment), refresh, close
//   const confirmDecision = async () => {
//     try {
//       const newStatus = actionType === "approve" ? "Approved" : "Rejected";
//       await fetch(`http://localhost:8080/api/leave/update/${selectedLeave.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...selectedLeave,
//           status: newStatus,
//           decisionComment: comment, // saved to backend as read-only in history
//         }),
//       });

//       showAlert(
//         `Leave request ${actionType === "approve" ? "approved" : "rejected"} successfully!`,
//         "success"
//       );
//       await fetchLeaves();
//       handleCloseDialog();
//     } catch (error) {
//       showAlert(`Failed to ${actionType} leave request`, "error");
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Approved":
//         return "success";
//       case "Rejected":
//         return "error";
//       default:
//         return "warning";
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "Approved":
//         return <CheckCircle sx={{ fontSize: 18 }} />;
//       case "Rejected":
//         return <Cancel sx={{ fontSize: 18 }} />;
//       default:
//         return <Schedule sx={{ fontSize: 18 }} />;
//     }
//   };

//   return (
//     <Box>
//       {/* Header */}
//       <Box sx={{ mb: 4 }}>
//         <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
//           <Box
//             sx={{
//               width: 60,
//               height: 60,
//               borderRadius: 3,
//               background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <CheckCircle sx={{ fontSize: 32, color: "white" }} />
//           </Box>
//           <Box>
//             <Typography variant="h4" fontWeight={800}>
//               Leave Approval Dashboard- Manager-Admin
//             </Typography>
//             <Typography variant="body1" color="text.secondary">
//               Review and manage employee leave requests
//             </Typography>
//           </Box>
//         </Box>
//       </Box>

//       {/* Statistics Cards */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         {[
//           { title: "Total Requests", value: stats.total, color: "#667eea", icon: <CalendarMonth /> },
//           { title: "Pending", value: stats.pending, color: "#f59e0b", icon: <Schedule /> },
//           { title: "Approved", value: stats.approved, color: "#10b981", icon: <CheckCircle /> },
//           { title: "Rejected", value: stats.rejected, color: "#ef4444", icon: <Cancel /> },
//         ].map((stat, i) => (
//           <Grid item xs={12} sm={6} md={3} key={i}>
//             <Card
//               sx={{
//                 borderRadius: 3,
//                 boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
//                 borderLeft: `4px solid ${stat.color}`,
//                 transition: "transform 0.2s",
//                 "&:hover": {
//                   transform: "translateY(-4px)",
//                   boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
//                 },
//               }}
//             >
//               <CardContent>
//                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//                   <Box>
//                     <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>
//                       {stat.title}
//                     </Typography>
//                     <Typography variant="h3" fontWeight={800} sx={{ color: stat.color }}>
//                       {stat.value}
//                     </Typography>
//                   </Box>
//                   <Box
//                     sx={{
//                       width: 48,
//                       height: 48,
//                       borderRadius: 2,
//                       background: `${stat.color}15`,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       color: stat.color,
//                     }}
//                   >
//                     {stat.icon}
//                   </Box>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Alert */}
//       {alert.open && (
//         <Fade in>
//           <Alert
//             severity={alert.severity}
//             sx={{ mb: 3, borderRadius: 2 }}
//             onClose={() => setAlert({ ...alert, open: false })}
//           >
//             {alert.message}
//           </Alert>
//         </Fade>
//       )}

//       {/* Filters and Search */}
//       <Paper sx={{ borderRadius: 3, mb: 3, overflow: "hidden" }}>
//         <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}>
//           <Tabs value={filterTab} onChange={(e, v) => setFilterTab(v)}>
//             <Tab label="All Requests" />
//             <Tab label="Pending" />
//             <Tab label="Approved" />
//             <Tab label="Rejected" />
//           </Tabs>
//         </Box>
//         <Box sx={{ p: 2 }}>
//           <TextField
//             fullWidth
//             placeholder="Search by Employee ID or Leave Type..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             InputProps={{
//               startAdornment: <Search sx={{ color: "text.secondary", mr: 1 }} />,
//             }}
//             sx={{
//               "& .MuiOutlinedInput-root": {
//                 borderRadius: 2,
//               },
//             }}
//           />
//         </Box>
//       </Paper>

//       {/* Leave Requests Grid */}
//       <Grid container spacing={3}>
//         {filteredLeaves.length === 0 ? (
//           <Grid item xs={12}>
//             <Paper
//               sx={{
//                 p: 8,
//                 textAlign: "center",
//                 borderRadius: 3,
//                 background: "#f9fafb",
//               }}
//             >
//               <CalendarMonth sx={{ fontSize: 64, color: "#cbd5e1", mb: 2 }} />
//               <Typography variant="h6" color="text.secondary">
//                 No leave requests found
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 {filterTab === 1 ? "No pending requests at the moment" : "Try adjusting your filters"}
//               </Typography>
//             </Paper>
//           </Grid>
//         ) : (
//           filteredLeaves.map((leave) => (
//             <Grid item xs={12} md={6} lg={4} key={leave.id}>
//               <Card
//                 sx={{
//                   borderRadius: 3,
//                   boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
//                   transition: "all 0.3s",
//                   "&:hover": {
//                     transform: "translateY(-4px)",
//                     boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
//                   },
//                 }}
//               >
//                 <CardContent>
//                   {/* Employee Info */}
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
//                     <Avatar
//                       sx={{
//                         width: 48,
//                         height: 48,
//                         background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                         fontWeight: 700,
//                       }}
//                     >
//                       {leave.employeeId?.charAt(0) || "E"}
//                     </Avatar>
//                     <Box sx={{ flex: 1 }}>
//                       <Typography variant="h6" fontWeight={700}>
//                         {leave.employeeId}
//                       </Typography>
//                       <Chip
//                         icon={getStatusIcon(leave.status)}
//                         label={leave.status}
//                         color={getStatusColor(leave.status)}
//                         size="small"
//                         sx={{ fontWeight: 600 }}
//                       />
//                     </Box>
//                   </Box>

//                   <Divider sx={{ my: 2 }} />

//                   {/* Leave Details */}
//                   <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                       <Description sx={{ color: "#764ba2", fontSize: 20 }} />
//                       <Typography variant="body2" color="text.secondary">
//                         Type:
//                       </Typography>
//                       <Typography variant="body2" fontWeight={600}>
//                         {leave.leaveType}
//                       </Typography>
//                     </Box>

//                     <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                       <DateRange sx={{ color: "#f093fb", fontSize: 20 }} />
//                       <Typography variant="body2" color="text.secondary">
//                         Duration:
//                       </Typography>
//                       <Typography variant="body2" fontWeight={600}>
//                         {leave.startDate} → {leave.endDate}
//                       </Typography>
//                     </Box>
//                   </Box>

//                   {/* Action Buttons */}
//                   {leave.status === "Pending" && (
//                     <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
//                       <Button
//                         fullWidth
//                         variant="contained"
//                         startIcon={<CheckCircle />}
//                         onClick={() => handleOpenDialog(leave, "approve")}
//                         sx={{
//                           background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
//                           textTransform: "none",
//                           fontWeight: 700,
//                           "&:hover": {
//                             background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
//                           },
//                         }}
//                       >
//                         Approve
//                       </Button>
//                       <Button
//                         fullWidth
//                         variant="contained"
//                         startIcon={<Cancel />}
//                         onClick={() => handleOpenDialog(leave, "reject")}
//                         sx={{
//                           background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
//                           textTransform: "none",
//                           fontWeight: 700,
//                           "&:hover": {
//                             background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
//                           },
//                         }}
//                       >
//                         Reject
//                       </Button>
//                     </Box>
//                   )}
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))
//         )}
//       </Grid>

//       {/* Approval/Rejection Dialog */}
//       <Dialog
//         open={dialogOpen}
//         onClose={handleCloseDialog}
//         maxWidth="sm"
//         fullWidth
//         PaperProps={{ sx: { borderRadius: 3 } }}
//       >
//         <DialogTitle
//           sx={{
//             fontWeight: 700,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             {actionType === "approve" ? (
//               <CheckCircle sx={{ color: "#10b981" }} />
//             ) : (
//               <Cancel sx={{ color: "#ef4444" }} />
//             )}
//             <Typography variant="h6" fontWeight={700}>
//               {actionType === "approve" ? "Approve" : "Reject"} Leave Request
//             </Typography>
//           </Box>
//           <IconButton onClick={handleCloseDialog} size="small">
//             <Close />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent>
//           {selectedLeave && (
//             <Box sx={{ mb: 3 }}>
//               {/* Employee Message preview */}
//               <Card variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
//                 <CardContent>
//                   <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                     Employee Message
//                   </Typography>
//                   <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
//                     {selectedLeave.message || "—"}
//                   </Typography>
//                 </CardContent>
//               </Card>

//               {/* Meta details */}
//               <Grid container spacing={2}>
//                 <Grid item xs={6}>
//                   <Typography variant="body2" color="text.secondary">Leave Type</Typography>
//                   <Typography variant="body1" fontWeight={600}>{selectedLeave.leaveType}</Typography>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Typography variant="body2" color="text.secondary">Duration</Typography>
//                   <Typography variant="body1" fontWeight={600}>
//                     {selectedLeave.startDate} → {selectedLeave.endDate}
//                   </Typography>
//                 </Grid>
//               </Grid>
//             </Box>
//           )}

//           {/* Approver Comment (decisionComment) */}
//           <TextField
//             fullWidth
//             multiline
//             minRows={3}
//             label="Approver Comment"
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             placeholder="Add any notes or reasons for your decision..."
//             sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
//           />
//         </DialogContent>

//         <DialogActions sx={{ p: 3, pt: 0 }}>
//           <Button onClick={handleCloseDialog} variant="outlined">Cancel</Button>
//           <Button
//             onClick={confirmDecision}
//             variant="contained"
//             sx={{
//               color: "white",
//               background:
//                 actionType === "approve"
//                   ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
//                   : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
//               "&:hover": {
//                 background:
//                   actionType === "approve"
//                     ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
//                     : "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
//               },
//             }}
//           >
//             Confirm {actionType === "approve" ? "Approval" : "Rejection"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }
