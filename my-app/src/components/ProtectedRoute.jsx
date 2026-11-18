import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import api from "../utils/ApiClient";

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("admin_token");

      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await api.get("/user");

        if (response.data.role === "admin") {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_user");
          setIsAuthenticated(false);
        }
      } catch {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Menunggu proses validasi token
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Memeriksa akses admin...
      </div>
    );
  }

  // Jika tidak valid, kembali ke halaman login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
