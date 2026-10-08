<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Store;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $store = Store::where('slug', 'ligglo-fashion-zone')->firstOrFail();

        $categories = [
            [
                'name'  => "Men's Fashion",
                'slug'  => 'mens-fashion',
                'image' => 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&auto=format&fit=crop&q=80',
                'children' => [
                    ['name' => 'Formal Shirts',    'slug' => 'formal-shirts'],
                    ['name' => 'Casual T-Shirts',  'slug' => 'casual-t-shirts'],
                    ['name' => 'Panjabi & Kurtas', 'slug' => 'panjabi-kurtas'],
                    ['name' => 'Jeans & Trousers', 'slug' => 'jeans-trousers'],
                ],
            ],
            [
                'name'  => "Women's Collection",
                'slug'  => 'womens-collection',
                'image' => 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80',
                'children' => [
                    ['name' => 'Kurtis & Tunics',        'slug' => 'kurtis-tunics'],
                    ['name' => 'Sarees & Traditional',   'slug' => 'sarees-traditional'],
                    ['name' => 'Western Wear',           'slug' => 'western-wear'],
                    ['name' => 'Handbags & Wallets',     'slug' => 'handbags-wallets'],
                ],
            ],
            [
                'name'  => 'Footwear',
                'slug'  => 'footwear',
                'image' => 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
                'children' => [
                    ['name' => 'Sneakers',        'slug' => 'sneakers'],
                    ['name' => 'Leather Loafers', 'slug' => 'leather-loafers'],
                    ['name' => 'Formal Shoes',    'slug' => 'formal-shoes'],
                ],
            ],
            [
                'name'  => 'Accessories & Bags',
                'slug'  => 'accessories-bags',
                'image' => 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&auto=format&fit=crop&q=80',
                'children' => [
                    ['name' => 'Leather Wallets', 'slug' => 'leather-wallets'],
                    ['name' => 'Belts',           'slug' => 'belts'],
                    ['name' => 'Sunglasses',      'slug' => 'sunglasses'],
                    ['name' => 'Backpacks',       'slug' => 'backpacks'],
                ],
            ],
            [
                'name'  => 'Home & Living',
                'slug'  => 'home-living',
                'image' => 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80',
                'children' => [
                    ['name' => 'Bedsheets & Linen', 'slug' => 'bedsheets-linen'],
                    ['name' => 'Cushions & Decor',  'slug' => 'cushions-decor'],
                ],
            ],
        ];

        foreach ($categories as $i => $catData) {
            $parent = Category::updateOrCreate(
                ['store_id' => $store->id, 'slug' => $catData['slug']],
                [
                    'store_id'   => $store->id,
                    'name'       => $catData['name'],
                    'image'      => $catData['image'],
                    'sort_order' => $i,
                    'is_active'  => true,
                ]
            );

            foreach ($catData['children'] as $j => $child) {
                Category::updateOrCreate(
                    ['store_id' => $store->id, 'slug' => $child['slug']],
                    [
                        'store_id'   => $store->id,
                        'parent_id'  => $parent->id,
                        'name'       => $child['name'],
                        'sort_order' => $j,
                        'is_active'  => true,
                    ]
                );
            }
        }

        $this->command->info('✅ Categories seeded: ' . Category::where('store_id', $store->id)->count() . ' total');
    }
}
