import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const isAdmin = () => {
  const user = localStorage.getItem("user");
  if (!user) return false;
  try {
    const parsed = JSON.parse(user);
    // Có thể là role hoặc roles (array/string)
    if (parsed.role) return parsed.role === "Admin";
    if (parsed.roles && Array.isArray(parsed.roles)) return parsed.roles.includes("Admin");
    return false;
  } catch {
    return false;
  }
};

export default function AdminRoute() {
  return isAdmin() ? <Outlet /> : <Navigate to="/access-denied" replace />;
} 