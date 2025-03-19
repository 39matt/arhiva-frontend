import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./components/common/Footer/Footer.tsx";
import Navbar from "./components/common/Navbar/Navbar.tsx";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
