// src/services/leaveApi.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/leave",
  headers: { "Content-Type": "application/json" },
});

export const fetchAllLeaves = () => api.get("/all");                 // READ
export const fetchLeaveById = (id) => api.get(`/${id}`);             // READ ONE
export const updateLeave = (id, data) => api.put(`/update/${id}`, data); // UPDATE
export const deleteLeave = (id) => api.delete(`/delete/${id}`);      // DELETE
