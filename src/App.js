// src/App.js
import { Route, Routes } from "react-router-dom";
import "./App.css";

// layout
import Navbar from "./pages/header/Navbar";

// pages
import Dashboard from "./pages/dashboard/dashboard";
import NoMatch from "./pages/noMatch/noMatch";
import CreateWorkSchedule from "./pages/workschedule/Createworkschedule";
import UpdateWorkSchedule from "./pages/workschedule/Updateworkschedule";
import Login from "./pages/login/login.js";
import Signup from "./pages/login/signup.js";

// auth
import { AuthProvider } from "./service/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        {/* public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateWorkSchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update/:id"
          element={
            <ProtectedRoute>
              <UpdateWorkSchedule />
            </ProtectedRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
