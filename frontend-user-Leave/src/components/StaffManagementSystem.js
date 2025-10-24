import React, { useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  CalendarMonth,
  PostAdd,
  People,
  Settings,
  Logout,
  CheckCircle, // Add this
} from "@mui/icons-material";

// Import your components
import LeaveRequestForm from './LeaveRequestForm';
import LeaveList from './LeaveList';
// import AdminLeaveApproval from './AdminLeaveApproval'; // Add this import

const drawerWidth = 280;

export default function StaffManagementSystem() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeView, setActiveView] = useState("apply");
  const isMobile = useMediaQuery("(max-width:900px)");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // UPDATE: Add the admin approval menu item
  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, view: "dashboard" },
    { text: "Apply Leave", icon: <PostAdd />, view: "apply" },
    { text: "Leave History", icon: <CalendarMonth />, view: "requests" },
    // { text: "Approve Leaves", icon: <CheckCircle />, view: "admin" }, // NEW
    // { text: "Employees", icon: <People />, view: "employees" },
  ];

  // ... rest of your drawer code stays the same ...

  const drawer = (
    <Box
      sx={{
        height: "100%",
        background: "linear-gradient(180deg, #667eea 0%, #764ba2 100%)",
        color: "white",
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(10px)",
          }}
        >
          <CalendarMonth sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={800}>
            Staff Management
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            System v1.0
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      {/* User Profile */}
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            borderRadius: 2,
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Avatar
            sx={{
              width: 48,
              height: 48,
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            }}
          >
            A
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" fontWeight={600}>
              De Silva K.T.S.
            </Typography>
            <Chip
              label="Employee"
              size="small"
              sx={{
                height: 20,
                fontSize: "0.7rem",
                background: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ px: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => {
                setActiveView(item.view);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2,
                background:
                  activeView === item.view ? "rgba(255,255,255,0.2)" : "transparent",
                "&:hover": {
                  background: "rgba(255,255,255,0.15)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: activeView === item.view ? 700 : 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", my: 2 }} />

      {/* Bottom Menu */}
      <List sx={{ px: 2 }}>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            sx={{
              borderRadius: 2,
              "&:hover": {
                background: "rgba(255,255,255,0.15)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              borderRadius: 2,
              "&:hover": {
                background: "rgba(239, 68, 68, 0.2)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* App Bar - Mobile Only */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <CalendarMonth sx={{ mr: 2 }} />
            <Typography variant="h6" noWrap fontWeight={700}>
              Staff Management System
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar Navigation */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          background: "#f8f9fa",
          pt: { xs: 8, md: 0 },
        }}
      >
        {/* Content Area */}
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          {activeView === "dashboard" && <DashboardView />}
          {activeView === "apply" && <ApplyLeaveView />}
          {activeView === "requests" && <LeaveRequestsView />}
          {/* {activeView === "admin" && <AdminView />} NEW  commented */}
          {activeView === "employees" && <EmployeesView />}
        </Box>
      </Box>
    </Box>
  );
}

// Dashboard View
function DashboardView() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        Dashboard
      </Typography>
      <Typography color="text.secondary" paragraph>
        Welcome to the Staff Management System
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr 1fr" },
          gap: 3,
          mt: 4,
        }}
      >
        {[
          { title: "Total Leaves", value: "24", color: "#667eea" },
          { title: "Pending", value: "8", color: "#f093fb" },
          { title: "Approved", value: "12", color: "#4ade80" },
          { title: "Rejected", value: "4", color: "#ef4444" },
        ].map((stat, i) => (
          <Box
            key={i}
            sx={{
              p: 3,
              borderRadius: 3,
              background: "white",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              borderLeft: `4px solid ${stat.color}`,
            }}
          >
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {stat.title}
            </Typography>
            <Typography variant="h3" fontWeight={800} sx={{ mt: 1 }}>
              {stat.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// Apply Leave View
function ApplyLeaveView() {
  return (
    <Box>
      <LeaveRequestForm />
    </Box>
  );
}

// Leave Requests View
function LeaveRequestsView() {
  return (
    <Box>
      <LeaveList />
    </Box>
  );
}

// NEW: Admin View
// function AdminView() {
//   return (
//     <Box>
//       <AdminLeaveApproval />
//     </Box>
//   );
// }

// Employees View
function EmployeesView() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        Employees
      </Typography>
      <Typography color="text.secondary" paragraph>
        Manage employee information
      </Typography>
      <Box
        sx={{
          mt: 4,
          p: 4,
          background: "white",
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <People sx={{ fontSize: 64, color: "#cbd5e1", mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          De Silva K.T.S.
        </Typography>
        <Typography variant="h7" color="text.secondary">
          Employyee ID : IT21328916
        </Typography>
      </Box>
    </Box>
  );
}