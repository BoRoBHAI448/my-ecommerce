<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Store;
use App\Models\Brand;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $store = Store::where('slug', 'ligglo-fashion-zone')->firstOrFail();

        $brands = [
            ['name' => 'Apex Artisan',  'slug' => 'apex-artisan'],
            ['name' => 'Nordic Thread', 'slug' => 'nordic-thread'],
            ['name' => 'Urban Edge',    'slug' => 'urban-edge'],
            ['name' => 'Loom & Craft',  'slug' => 'loom-craft'],
            ['name' => 'Velvet Luxe',   'slug' => 'velvet-luxe'],
            ['name' => 'Terra Sole',    'slug' => 'terra-sole'],
        ];

        foreach ($brands as $brand) {
            Brand::updateOrCreate(
                ['store_id' => $store->id, 'slug' => $brand['slug']],
                ['store_id' => $store->id, 'name' => $brand['name'], 'is_active' => true]
            );
        }

        $this->command->info('✅ Brands seeded: ' . count($brands));
    }
}
