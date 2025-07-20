import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const isStudent = () => {
  const user = localStorage.getItem("user");
  if (!user) return false;
  try {
    const parsed = JSON.parse(user);
    // Có thể là role hoặc roles (array/string)
    if (parsed.role) return parsed.role === "Student";
    if (parsed.roles && Array.isArray(parsed.roles)) return parsed.roles.includes("Student");
    return false;
  } catch {
    return false;
  }
};

export default function AdminRoute() {
  return isStudent() ? <Outlet /> : <Navigate to="/access-denied" replace />;
} 