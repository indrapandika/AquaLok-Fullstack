/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
} from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import api from "./ApiClient";
import { getImageUrl } from "./ApiClient";

const ProductContext = createContext(null);

function mapProduct(item) {
  return {
    id: item.product_id,
    name: item.name,
    description: item.description || "",
    category: item.category?.category || "Lainnya",
    category_id: item.category_id,
    price: Number(item.price),
    stock: Number(item.stock),
    image: getImageUrl(item.img),
    slug: item.slug,
  };
}

async function fetchProducts(params = {}) {
  const response = await api.get("/products", { params });
  const payload = response.data;

  return {
    ...payload,
    data: (payload.data || []).map(mapProduct),
  };
}

// GET /products?page=&limit=&category_id=&keyword=  (pagination + filter)
const getProducts = async ({
  page = 1,
  limit = 10,
  category_id = "",
  keyword = "",
} = {}) => fetchProducts({ page, limit, category_id, keyword });

// SHOW PRODUCT DETAIL
const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return mapProduct(res.data.data);
};

// GET /categories
const getCategories = async () => {
  const res = await api.get("/categories");
  return res.data.data || [];
};

export function ProductProvider({ children }) {
  const queryClient = useQueryClient();

  // Data produk untuk katalog pelanggan.
  const {
    data: productResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products", "storefront"],
    queryFn: () => fetchProducts({ limit: 100 }),
  });

  // Kategori digunakan pada form tambah/edit dan filter admin.
  const {
    data: categoryResponse,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const createMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await api.post("/products", formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }) => {
      // _method digunakan agar upload FormData dapat diproses oleh Laravel.
      formData.set("_method", "PUT");
      const response = await api.post(`/products/${id}`, formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const value = {
    products: productResponse?.data || [],
    isLoading,
    isError,
    error,
    refetch,
    categories: categoryResponse || [],
    isCategoriesLoading,
    isCategoriesError,
    getProducts,
    getProductById,
    getCategories,
    addProduct: (formData) => createMutation.mutateAsync(formData),
    updateProduct: (id, formData) =>
      updateMutation.mutateAsync({ id, formData }),
    deleteProduct: (id) => deleteMutation.mutateAsync(id),
    isSaving:
      createMutation.isPending || updateMutation.isPending,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProducts harus digunakan di dalam ProductProvider.");
  }

  return context;
}
