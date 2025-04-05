import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoanRequestPage from "../pages/loanRequestPage";
import AdminLoginPage from "../pages/AdminLoginPage";
import DashboardPage from "../pages/DashboardPage.tsx";

import MainLayout from "./MainLayout";
import ProtectedRoute from "./ProtectedRoute";

import { UserProvider } from "../contexts/UserContext";

const App = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<LoanRequestPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/admin/dashboard" element={<DashboardPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
};
export default App;
