<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    // Menampilkan produk dengan pencarian, filter kategori, dan pagination.
    public function index(Request $request)
    {
        $limit = (int) $request->query('limit', 12);
        $limit = max(1, min($limit, 100));

        $query = Product::with('category')->latest('product_id');

        if ($request->filled('keyword')) {
            $keyword = $request->query('keyword');
            $query->where(function ($builder) use ($keyword) {
                $builder->where('name', 'like', "%{$keyword}%")
                    ->orWhere('description', 'like', "%{$keyword}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->query('category_id'));
        }

        $products = $query->paginate($limit)->withQueryString();

        return response()->json([
            'success' => true,
            'message' => 'Daftar data produk berhasil diambil.',
            'data' => $products->items(),
            'current_page' => $products->currentPage(),
            'last_page' => $products->lastPage(),
            'per_page' => $products->perPage(),
            'total' => $products->total(),
        ]);
    }

    // Menambahkan produk baru.
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'category_id' => 'required|exists:categories,category_id',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'img' => $request->hasFile('img')
                ? 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048'
                : 'nullable|string|max:255',
        ]);

        $imagePath = $validated['img'] ?? null;
        if ($request->hasFile('img')) {
            $imagePath = $this->storeImage($request);
        }

        $product = Product::create([
            'name' => $validated['name'],
            'slug' => $this->uniqueSlug($validated['name']),
            'category_id' => $validated['category_id'],
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'description' => $validated['description'] ?? null,
            'img' => $imagePath,
        ])->load('category');

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil ditambahkan.',
            'data' => $product,
        ], 201);
    }

    // Menampilkan detail satu produk.
    public function show($id)
    {
        $product = Product::with('category')->find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail data produk berhasil diambil.',
            'data' => $product,
        ]);
    }

    // Memperbarui produk. Form React menggunakan POST + _method=PUT
    // agar upload multipart dapat diproses dengan konsisten oleh PHP.
    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan.',
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'category_id' => 'required|exists:categories,category_id',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'img' => $request->hasFile('img')
                ? 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048'
                : 'nullable|string|max:255',
        ]);

        $imagePath = $validated['img'] ?? $product->img;
        if ($request->hasFile('img')) {
            $imagePath = $this->storeImage($request);
            $this->deleteManagedImage($product->img);
        }

        $product->update([
            'name' => $validated['name'],
            'slug' => $this->uniqueSlug($validated['name'], $product->product_id),
            'category_id' => $validated['category_id'],
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'description' => $validated['description'] ?? null,
            'img' => $imagePath,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data produk berhasil diperbarui.',
            'data' => $product->fresh('category'),
        ]);
    }

    // Menghapus produk.
    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan.',
            ], 404);
        }

        $this->deleteManagedImage($product->img);
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data produk berhasil dihapus.',
        ]);
    }

    private function storeImage(Request $request): string
    {
        $directory = public_path('images/products');
        File::ensureDirectoryExists($directory);

        $file = $request->file('img');
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $file->move($directory, $filename);

        return 'images/products/' . $filename;
    }

    private function deleteManagedImage(?string $imagePath): void
    {
        if (!$imagePath || !str_starts_with($imagePath, 'images/products/')) {
            return;
        }

        $fullPath = public_path($imagePath);
        if (File::exists($fullPath)) {
            File::delete($fullPath);
        }
    }

    private function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $counter = 1;

        while (
            Product::where('slug', $slug)
                ->when($ignoreId, fn ($query) => $query->where('product_id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = $baseSlug . '-' . $counter++;
        }

        return $slug;
    }
}
