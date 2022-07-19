import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "hooks/useAuth";

const RequireAuth = () => {
  const { auth } = useAuth();
  return auth?.user || localStorage.getItem("token") ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default RequireAuth;
