import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../utils/CartContext";
import api from "../../utils/ApiClient";
import toast from "react-hot-toast";

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error("Keranjang masih kosong!");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customer_name: formData.name,
        phone: formData.phone,
        address: formData.address,
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.qty,
        })),
      };

      const response = await api.post("/orders", orderData);

      if (response.data.success) {
        toast.success("Pesanan berhasil disimpan!");

        clearCart();
        navigate("/");
      }
    } catch (error) {
      console.error("Checkout error:", error);

      const message =
        error.response?.data?.message ||
        "Gagal membuat pesanan. Silakan coba lagi.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-xl mx-auto my-8">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Keranjang Anda Masih Kosong
        </h2>

        <p className="text-gray-500 text-sm mb-4">
          Pilih produk terlebih dahulu sebelum melakukan checkout.
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
        >
          Lihat Produk
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">
        Formulir Checkout
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Lengkap
          </label>

          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="Masukkan nama lengkap Anda"
            className="w-full border border-gray-200 rounded-md p-2.5 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nomor Telepon / WhatsApp
          </label>

          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="08123456789"
            className="w-full border border-gray-200 rounded-md p-2.5 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alamat Pengiriman
          </label>

          <textarea
            required
            rows="3"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            placeholder="Masukkan alamat pengiriman lengkap Anda"
            className="w-full border border-gray-200 rounded-md p-2.5 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-md space-y-2 mt-4">
          <h4 className="font-bold text-sm text-gray-700 mb-2">
            Ringkasan Pesanan
          </h4>

          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between text-xs text-gray-600"
            >
              <span>
                {item.name} ({item.qty}x)
              </span>

              <span>
                Rp {(Number(item.price) * item.qty).toLocaleString("id-ID")}
              </span>
            </div>
          ))}

          <div className="border-t pt-2 mt-2 flex justify-between font-bold text-sm text-gray-800">
            <span>Total Pembayaran</span>

            <span className="text-blue-600">
              Rp {totalPrice.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-medium py-3 rounded-md hover:bg-blue-700 transition text-sm mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Memproses Pesanan..." : "Buat Pesanan Sekarang"}
        </button>
      </form>
    </div>
  );
}
