import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => !!localStorage.getItem("token");

export default function PrivateRoute() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
} 