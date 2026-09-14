import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar.jsx";

const MainLayout = () => {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-container">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
