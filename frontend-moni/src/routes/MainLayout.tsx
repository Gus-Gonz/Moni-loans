import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/TopBar";

const MainLayout = () => {
  return (
    <div>
      <TopBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
