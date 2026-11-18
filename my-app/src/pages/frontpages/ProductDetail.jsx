import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../../utils/CartContext";
import { useProducts } from "../../utils/ProductContext";
import ReviewSection from "../../components/ReviewSection";

export default function ProductDetail() {
  const { id } = useParams();

  // Mengambil data produk dari Laravel API
  const {
    products,
    isLoading,
    isError,
  } = useProducts();

  // Mencari produk berdasarkan ID
  const product = products.find(
    (p) => String(p.id) === String(id)
  );

  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

  // Mengurangi jumlah produk
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Menambah jumlah produk sesuai stok
  const handleIncrease = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  // Menambahkan produk ke keranjang
  const handleAddToCart = () => {
  const success = addToCart(product, quantity);

  if (success) {
    toast.success(
      `${quantity} ${product.name} berhasil ditambahkan ke keranjang!`
    );
    setQuantity(1);
  } else {
    toast.error("Jumlah produk melebihi stok tersedia!");
  }
};

  // Kondisi ketika data sedang dimuat
  if (isLoading) {
    return (
      <div className="text-center py-12 text-slate-500 font-medium">
        Memuat detail produk...
      </div>
    );
  }

  // Kondisi ketika API mengalami error
  if (isError) {
    return (
      <div className="text-center py-12 text-red-500 font-medium">
        Gagal memuat detail produk.
        <br />
        Silakan coba kembali.
      </div>
    );
  }

  // Kondisi ketika produk tidak ditemukan
  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700">
          Produk tidak ditemukan
        </h2>

        <Link
          to="/"
          className="inline-block mt-4 text-blue-600 hover:underline"
        >
          &larr; Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  // Gambar cadangan jika gambar produk tidak tersedia
  const imageSrc =
    product.image ||
    "https://placehold.co/600x450?text=Produk+AquaLok";

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm max-w-4xl mx-auto space-y-8">

      {/* Tombol Kembali */}
      <Link
        to="/"
        className="inline-block mb-6 text-sm text-blue-600 hover:underline font-medium"
      >
        &larr; Kembali ke Dashboard
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Gambar Produk */}
        <div className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center p-4">
          <img
            src={imageSrc}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://placehold.co/600x450?text=Gambar+Tidak+Tersedia";
            }}
            className="w-full h-80 object-cover rounded-md"
          />
        </div>

        {/* Informasi Detail Produk */}
        <div className="flex flex-col justify-between space-y-4">
          <div>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded font-semibold mb-2">
              {product.category}
            </span>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {product.name}
            </h1>

            <p className="text-2xl font-semibold text-blue-600 mb-4">
              Rp {product.price?.toLocaleString("id-ID")}
            </p>

            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {product.description}
            </p>

            <p className="text-sm text-gray-500 mb-4">
              Stok Tersedia:{" "}
              <span className="font-semibold text-gray-800">
                {product.stock}
              </span>
            </p>

            {/* Pengatur Jumlah Produk */}
            {product.stock > 0 && (
              <div className="flex items-center gap-3 my-4">
                <span className="text-sm font-medium text-gray-700">
                  Jumlah:
                </span>

                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={handleDecrease}
                    disabled={quantity <= 1}
                    className="px-3 py-1 bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-md"
                  >
                    -
                  </button>

                  <span className="px-4 py-1 text-sm font-semibold text-gray-800">
                    {quantity}
                  </span>

                  <button
                    onClick={handleIncrease}
                    disabled={quantity >= product.stock}
                    className="px-3 py-1 bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-md"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tombol Tambah ke Keranjang */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full py-3 rounded-md font-semibold text-white transition ${
              product.stock > 0
                ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {product.stock > 0
              ? `+ Tambah ke Keranjang (${quantity})`
              : "Stok Habis"}
          </button>
        </div>
      </div>

      {/* Bagian Review dan Rating */}
      <ReviewSection productId={product.id} />

    </div>
  );
}
