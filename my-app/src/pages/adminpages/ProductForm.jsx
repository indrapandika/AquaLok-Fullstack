import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useProducts } from "../../utils/ProductContext";
import ProductFormFields from "./ProductFormFields";

const initialValues = {
  name: "",
  category_id: "",
  price: "",
  stock: "",
  description: "",
};

function getValidationErrors(error) {
  const validation = error.response?.data?.errors;
  if (!validation) return {};
  return Object.fromEntries(
    Object.entries(validation).map(([key, messages]) => [key, messages[0]])
  );
}

export default function ProductForm() {
  const navigate = useNavigate();
  const { categories, isCategoriesLoading, addProduct, isSaving } =
    useProducts();
  const [values, setValues] = useState(initialValues);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : "");
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
      await addProduct(formData);
      toast.success("Produk berhasil ditambahkan.");
      setTimeout(() => navigate("/admin/dashboard"), 1000);
    } catch (error) {
      const validationErrors = getValidationErrors(error);
      setErrors({
        ...validationErrors,
        general: Object.keys(validationErrors).length
          ? ""
          : error.response?.data?.message || "Gagal menambahkan produk.",
      });
      toast.error("Periksa kembali data produk.");
    }
  };

  if (isCategoriesLoading) {
    return <p className="text-slate-500">Memuat kategori...</p>;
  }

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
          Tambah Produk
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Isi informasi produk yang akan ditampilkan di katalog.
        </p>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
        {categories.length === 0 ? (
          <p className="text-sm text-red-600">
            Kategori belum tersedia. Periksa endpoint /api/categories.
          </p>
        ) : (
          <ProductFormFields
            values={values}
            onChange={{ field: handleFieldChange, submit: handleSubmit }}
            categories={categories}
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
            errors={errors}
            saving={isSaving}
            submitLabel="Simpan Produk"
          />
        )}
      </div>
    </section>
  );
}
