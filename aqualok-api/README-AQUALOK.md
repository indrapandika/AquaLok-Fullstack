# AquaLok Store - Laravel REST API

## Persiapan

1. Pastikan PHP, Composer, dan MySQL sudah tersedia.
2. Salin `.env.example` menjadi `.env`.
3. Atur koneksi database pada `.env` sesuai MySQL lokal.
4. Jalankan:

```bash
composer install
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

Backend secara default berjalan pada `http://127.0.0.1:8000`.

Akun admin demo dari seeder: `test@example.com` / `password`.

Jika database baru belum memiliki kategori, jalankan:

```bash
php artisan db:seed --class=CategorySeeder
```

Seeder kategori menggunakan ID 1, 2, dan 3 untuk Ikan Hias, Pakan Ikan, dan Aquarium. Seeder produk demo dapat dijalankan dengan `php artisan db:seed --class=ProductSeeder`.

## Endpoint utama

| Method | Endpoint | Akses |
|---|---|---|
| GET | `/api/products` | Publik |
| GET | `/api/products/{id}` | Publik |
| GET | `/api/categories` | Publik |
| POST | `/api/products` | Admin |
| PUT/PATCH | `/api/products/{id}` | Admin |
| DELETE | `/api/products/{id}` | Admin |
| POST | `/api/login` | Publik |
| GET | `/api/user` | Login |
| POST | `/api/logout` | Login |
| POST | `/api/orders` | Publik |
| GET | `/api/orders` | Admin |
| PATCH | `/api/orders/{id}/status` | Admin |

## Query produk

Endpoint `GET /api/products` mendukung:

- `page`: nomor halaman
- `limit`: jumlah produk per halaman (maksimal 100)
- `keyword`: pencarian nama/deskripsi
- `category_id`: filter kategori

Contoh:

`/api/products?page=1&limit=8&keyword=cupang&category_id=1`

Gambar yang diunggah admin disimpan pada `public/images/products`.
