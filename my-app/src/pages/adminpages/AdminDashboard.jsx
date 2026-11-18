import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useProducts } from "../../utils/ProductContext";

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const PLACEHOLDER = "https://placehold.co/80x80?text=Produk";
const LIMIT = 8;

export default function AdminDashboard() {
  const { categories, deleteProduct, getProducts } = useProducts();

  // State input filter (belum diterapkan sampai tombol "Cari" ditekan)
  const [keywordInput, setKeywordInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");

  // State filter yang sedang aktif + halaman
  const [filters, setFilters] = useState({ keyword: "", category_id: "" });
  const [page, setPage] = useState(1);

  const params = { page, limit: LIMIT, ...filters };

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["products", "admin", params],
    queryFn: () => getProducts(params),
    placeholderData: (previous) => previous,
  });

  const products = data?.data || [];
  const lastPage = data?.last_page || 1;
  const currentPage = data?.current_page || page;
  const total = data?.total || 0;
  const offset = (currentPage - 1) * LIMIT;

  // Tombol Cari: terapkan filter dan kembali ke halaman 1
  const handleSearch = (event) => {
    event.preventDefault();
    setFilters({ keyword: keywordInput.trim(), category_id: categoryInput });
    setPage(1);
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus produk "${product.name}"?`
    );
    if (!confirmed) return;

    try {
      await deleteProduct(product.id);
      toast.success("Produk berhasil dihapus.");
      if (products.length === 1 && page > 1) setPage((p) => p - 1);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Terjadi kesalahan saat menghapus produk."
      );
    }
  };

  const pageNumbers = Array.from({ length: lastPage }, (_, i) => i + 1);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Manajemen Produk</h1>

      {/* Search & Filter Panel */}
      <div className="flex flex-col gap-3 rounded bg-white p-4 shadow md:flex-row md:items-center md:justify-between">
        <form onSubmit={handleSearch} className="flex flex-1 flex-wrap gap-2">
          <select
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.category}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            placeholder="Cari produk..."
            className="min-w-[180px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Cari
          </button>
        </form>

        <Link
          to="/admin/add-product"
          className="rounded-lg bg-green-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-green-700"
        >
          + Tambah Produk
        </Link>
      </div>

      <div className="rounded bg-white p-4 shadow">
        <p className="mb-3 text-sm text-slate-500">
          {total} produk{isFetching ? " • Memperbarui..." : ""}
        </p>

        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p className="text-red-600">Error loading products.</p>
        ) : products.length === 0 ? (
          <p className="py-6 text-center text-slate-500">
            Produk tidak ditemukan.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border text-left text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">#</th>
                  <th className="border p-2">Image</th>
                  <th className="border p-2">Nama</th>
                  <th className="border p-2">Harga</th>
                  <th className="border p-2">Stok</th>
                  <th className="border p-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, index) => (
                  <tr key={p.id}>
                    <td className="border p-2">{offset + index + 1}</td>
                    <td className="border p-2">
                      <img
                        src={p.image || PLACEHOLDER}
                        alt={p.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = PLACEHOLDER;
                        }}
                        className="h-16 w-16 object-cover"
                      />
                    </td>
                    <td className="border p-2">
                      {p.name} <br />
                      <small className="text-gray-500">#{p.category}</small>
                    </td>
                    <td className="border p-2">{formatRupiah(p.price)}</td>
                    <td className="border p-2">{p.stock}</td>
                    <td className="space-x-2 border p-2">
                      <Link
                        to={`/admin/edit-product/${p.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p)}
                        className="cursor-pointer text-red-600 hover:underline"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Control */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 border-t pt-4">
          <button
            type="button"
            disabled={page <= 1 || isFetching}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Sebelumnya
          </button>

          {pageNumbers.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              className={`rounded border px-3 py-1.5 text-sm ${
                n === currentPage
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "hover:bg-slate-100"
              }`}
            >
              {n}
            </button>
          ))}

          <button
            type="button"
            disabled={page >= lastPage || isFetching}
            onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
            className="rounded border border-blue-600 bg-blue-600 px-3 py-1.5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>
  );
}
