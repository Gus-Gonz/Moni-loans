import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import Auth from "../utils/Auth";

const ProtectedRoute = () => {
  const isAuth = Auth.isAuthenticated();

  return isAuth ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
