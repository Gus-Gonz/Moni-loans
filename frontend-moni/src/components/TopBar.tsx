import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Button } from "./Button";
import { useUser } from "../contexts/UserContext";
import Auth from "../utils/Auth";

const TopBar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const handleLogout = () => {
    Auth.clearTokens();
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-white text-black py-4 px-6 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-end items-center">
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm hidden sm:inline">
                Welcome, <strong>{user.username}</strong>!
              </span>
              <Button variant="white" onClick={() => navigate("/")}>Loan Form</Button>
              <Button variant="white" onClick={() => navigate("/admin/dashboard")}>Dashboard</Button>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <Button onClick={() => navigate("/admin/login")}>
              Admin Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
