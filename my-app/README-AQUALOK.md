# AquaLok Store - React Frontend

## Persiapan

1. Pastikan backend Laravel sudah berjalan di `http://127.0.0.1:8000`.
2. Salin `.env.example` menjadi `.env`.
3. Pastikan nilai `VITE_API_URL` mengarah ke endpoint API Laravel.
4. Buka terminal pada folder frontend, lalu jalankan:

```bash
npm install
npm run dev
```

Frontend secara default berjalan pada `http://localhost:5173`.

## Halaman admin

- `/admin/login` - login admin
- `/admin/dashboard` - manajemen produk (cari, filter kategori, pagination, edit, hapus)
- `/admin/orders` - daftar pesanan
- `/admin/add-product` - tambah produk
- `/admin/edit-product/:id` - edit produk

Semua halaman di bawah `/admin` memerlukan token admin dari Laravel Sanctum.

## Fitur integrasi

- Axios untuk komunikasi HTTP ke Laravel API.
- React Query untuk mengambil data, mutation, cache, dan invalidasi.
- ProductContext untuk berbagi data produk dan fungsi CRUD.
- React Hot Toast untuk notifikasi.
- FormData untuk mengirim data dan gambar produk.
- Pagination, pencarian, dan filter kategori pada halaman manajemen produk.
