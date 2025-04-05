import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoanRequestPage from "../pages/loanRequestPage";

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoanRequestPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
