<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Ikan Mas Koki Oranda',
                'description' => 'Ikan hias mas koki varietas Oranda warna merah putih ukuran 8-10 cm.',
                'category_id' => 1,
                'price' => 35000.00,
                'img' => 'images/products/mas koki.jpg',
                'stock' => 20,
                'slug' => 'ikan-mas-koki-oranda',
            ],
            [
                'name' => 'Pakan Ikan Akari',
                'description' => 'Pakan ikan hias untuk membantu memenuhi kebutuhan nutrisi ikan.',
                'category_id' => 2,
                'price' => 15000.00,
                'img' => 'images/products/akari.jpg',
                'stock' => 50,
                'slug' => 'pakan-ikan-akari',
            ],
        ];

        foreach ($products as $product) {
            DB::table('products')->updateOrInsert(
                ['slug' => $product['slug']],
                [
                    ...$product,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
