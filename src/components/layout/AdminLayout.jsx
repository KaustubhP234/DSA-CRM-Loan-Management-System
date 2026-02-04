import { Outlet } from "react-router-dom";
import AdminHeader from "../AdminHeader";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <>
      <style>{`
        .admin-layout-container {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
        }

        .admin-content-wrapper {
          flex: 1;
          margin-left: 280px;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          transition: margin-left 0.3s ease;
        }

        .admin-main-content {
          flex: 1;
          padding: 24px;
          overflow-x: hidden;
        }

        /* Responsive */
        @media (max-width: 968px) {
          .admin-content-wrapper {
            margin-left: 80px;
          }
        }

        @media (max-width: 768px) {
          .admin-content-wrapper {
            margin-left: 0;
          }
        }
      `}</style>

      <div className="admin-layout-container">
        <AdminSidebar />
        
        <div className="admin-content-wrapper">
          <AdminHeader />
          <div className="admin-main-content">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;