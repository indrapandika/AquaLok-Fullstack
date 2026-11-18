export default function ProductFormFields({
  values,
  onChange,
  categories,
  imagePreview,
  onImageChange,
  errors = {},
  saving = false,
  submitLabel = "Simpan Produk",
}) {
  return (
    <form onSubmit={onChange.submit} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Nama Produk
        </label>
        <input
          name="name"
          value={values.name}
          onChange={onChange.field}
          required
          maxLength={150}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
          placeholder="Contoh: Ikan Cupang Halfmoon"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Kategori
        </label>
        <select
          name="category_id"
          value={values.category_id}
          onChange={onChange.field}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
        >
          <option value="">Pilih kategori</option>
          {categories.map((category) => (
            <option
              key={category.category_id}
              value={category.category_id}
            >
              {category.category}
            </option>
          ))}
        </select>
        {errors.category_id && (
          <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Harga (Rp)
          </label>
          <input
            name="price"
            type="number"
            min="0"
            step="1"
            value={values.price}
            onChange={onChange.field}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Stok
          </label>
          <input
            name="stock"
            type="number"
            min="0"
            step="1"
            value={values.stock}
            onChange={onChange.field}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
          />
          {errors.stock && (
            <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Deskripsi
        </label>
        <textarea
          name="description"
          rows="4"
          value={values.description}
          onChange={onChange.field}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
          placeholder="Masukkan deskripsi produk..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Gambar Produk (JPG, PNG, atau WEBP; maksimal 2 MB)
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onImageChange}
          className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview produk"
            className="mt-3 h-36 w-36 rounded-lg border object-cover"
          />
        )}
        {errors.img && (
          <p className="mt-1 text-sm text-red-600">{errors.img}</p>
        )}
      </div>

      {errors.general && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {errors.general}
        </p>
      )}

      <button
        type="submit"
        disabled={saving || categories.length === 0}
        className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Menyimpan..." : submitLabel}
      </button>
    </form>
  );
}
