import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useProducts } from "../../utils/ProductContext";
import ProductFormFields from "./ProductFormFields";

function getValidationErrors(error) {
  const validation = error.response?.data?.errors;
  if (!validation) return {};
  return Object.fromEntries(
    Object.entries(validation).map(([key, messages]) => [key, messages[0]])
  );
}

export default function ProductEdit() {
  const { id } = useParams();
  const {
    categories,
    isCategoriesLoading,
    updateProduct,
    getProductById,
    isSaving,
  } = useProducts();
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
  });

  if (isLoading || isCategoriesLoading) {
    return <p className="text-slate-500">Memuat data produk...</p>;
  }

  if (isError || !product) {
    return (
      <div className="space-y-3">
        <p className="text-red-600">Data produk tidak ditemukan.</p>
        <Link to="/admin/dashboard" className="text-blue-600 hover:underline">
          Kembali ke Manajemen Produk
        </Link>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <p className="text-sm text-red-600">
        Kategori belum tersedia. Periksa endpoint /api/categories.
      </p>
    );
  }

  return (
    <ProductEditForm
      key={product.id}
      product={product}
      categories={categories}
      updateProduct={updateProduct}
      isSaving={isSaving}
    />
  );
}

function ProductEditForm({ product, categories, updateProduct, isSaving }) {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: product.name || "",
    category_id: String(product.category_id || ""),
    price: String(product.price ?? ""),
    stock: String(product.stock ?? ""),
    description: product.description || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(product.image || "");
  const [errors, setErrors] = useState({});

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : product.image || "");
    setErrors((current) => ({ ...current, img: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (imageFile) formData.append("img", imageFile);

    try {
      await updateProduct(product.id, formData);
      toast.success("Produk berhasil diperbarui.");
      navigate("/admin/dashboard");
    } catch (error) {
      const validationErrors = getValidationErrors(error);
      setErrors({
        ...validationErrors,
        general: Object.keys(validationErrors).length
          ? ""
          : error.response?.data?.message || "Gagal memperbarui produk.",
      });
      toast.error("Periksa kembali data produk.");
    }
  };

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <div>
        <Link
          to="/admin/dashboard"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Kembali ke Manajemen Produk
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-800">
          Edit Produk
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Perbarui informasi {product.name}.
        </p>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
        <ProductFormFields
          values={values}
          onChange={{ field: handleFieldChange, submit: handleSubmit }}
          categories={categories}
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
          errors={errors}
          saving={isSaving}
          submitLabel="Simpan Perubahan"
        />
      </div>
    </section>
  );
}
