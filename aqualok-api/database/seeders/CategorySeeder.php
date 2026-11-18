<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            1 => 'Ikan Hias',
            2 => 'Pakan Ikan',
            3 => 'Aquarium',
        ];

        foreach ($categories as $categoryId => $categoryName) {
            DB::table('categories')->updateOrInsert(
                ['category_id' => $categoryId],
                [
                    'category' => $categoryName,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
