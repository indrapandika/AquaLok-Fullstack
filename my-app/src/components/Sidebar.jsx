import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/ApiClient";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch {
      // Token mungkin sudah tidak berlaku; data lokal tetap dibersihkan.
    } finally {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      delete api.defaults.headers.common.Authorization;
      toast.success("Berhasil logout.");
      navigate("/admin/login");
    }
  };

  const closeMobileSidebar = () => setSidebarOpen(false);

  return (
    <aside
      className={`${
        sidebarOpen ? "block" : "hidden"
      } md:block w-64 shrink-0 bg-white shadow-md`}
    >
      <div className="border-b p-4 text-xl font-bold text-slate-800">
        AquaLok Admin
      </div>

      <nav className="flex flex-col gap-2 p-4">
        <Link
          to="/admin/dashboard"
          onClick={closeMobileSidebar}
          className="rounded-lg p-2 hover:bg-slate-100"
        >
          Dashboard (Produk)
        </Link>
        <Link
          to="/admin/orders"
          onClick={closeMobileSidebar}
          className="rounded-lg p-2 hover:bg-slate-100"
        >
          Pesanan
        </Link>
        <Link
          to="/admin/about"
          onClick={closeMobileSidebar}
          className="rounded-lg p-2 hover:bg-slate-100"
        >
          About
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 rounded-lg border border-red-200 p-2 text-left font-medium text-red-600 hover:bg-red-50"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}
