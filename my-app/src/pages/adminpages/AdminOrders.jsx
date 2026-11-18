import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../utils/ApiClient";
import toast from "react-hot-toast";

export default function AdminOrders() {
  const queryClient = useQueryClient();

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await api.get("/orders");
      return response.data.data || [];
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ orderId, newStatus }) => {
      await api.patch(`/orders/${orderId}/status`, {
        status: newStatus,
      });
      return { orderId, newStatus };
    },
    onSuccess: ({ orderId, newStatus }) => {
      queryClient.setQueryData(["orders"], (previousOrders = []) =>
        previousOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );
      toast.success("Status pesanan berhasil diperbarui!");
    },
    onError: () => {
      toast.error("Gagal mengubah status pesanan.");
    },
  });

  const handleStatusChange = (orderId, newStatus) => {
    statusMutation.mutate({ orderId, newStatus });
  };

  const formatRupiah = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(price || 0));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Daftar Pesanan</h1>

      {/* Ringkasan pesanan */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded bg-white p-5 shadow">
          <p className="text-gray-500">Total Pesanan</p>
          <h2 className="text-2xl font-bold">{orders.length}</h2>
        </div>

        <div className="rounded bg-white p-5 shadow">
          <p className="text-gray-500">Pesanan Pending</p>
          <h2 className="text-2xl font-bold">
            {orders.filter((order) => order.status === "pending").length}
          </h2>
        </div>

        <div className="rounded bg-white p-5 shadow">
          <p className="text-gray-500">Pesanan Selesai</p>
          <h2 className="text-2xl font-bold">
            {orders.filter((order) => order.status === "completed").length}
          </h2>
        </div>
      </div>

      {/* Tabel pesanan */}
      <div className="rounded bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-bold">Daftar Pesanan</h2>

        {isLoading ? (
          <p className="text-gray-500">Memuat data pesanan...</p>
        ) : isError ? (
          <p className="text-red-600">Gagal mengambil data pesanan.</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">Belum ada pesanan.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Pelanggan</th>
                  <th className="p-3">Produk</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="p-3">#{order.id}</td>
                    <td className="p-3">
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-gray-500">{order.phone}</p>
                      <p className="text-gray-500">{order.address}</p>
                    </td>
                    <td className="p-3">
                      {order.items?.map((item) => (
                        <div key={item.id} className="mb-1">
                          {item.product?.name || "Produk tidak ditemukan"}
                          {" "}({item.quantity} x {formatRupiah(item.price)})
                        </div>
                      ))}
                    </td>
                    <td className="p-3 font-medium">
                      {formatRupiah(order.total_price)}
                    </td>
                    <td className="p-3">
                      {new Date(order.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="p-3">
                      <select
                        value={order.status}
                        disabled={statusMutation.isPending}
                        onChange={(event) =>
                          handleStatusChange(order.id, event.target.value)
                        }
                        className="rounded border p-2"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
