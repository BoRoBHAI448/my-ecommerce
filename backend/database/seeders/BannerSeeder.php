<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Store;
use App\Models\Banner;

class BannerSeeder extends Seeder
{
    public function run(): void
    {
        $store = Store::where('slug', 'ligglo-fashion-zone')->firstOrFail();

        $banners = [
            [
                'title'    => 'New Season Autumn Elegance',
                'subtitle' => 'Discover modern tailoring, luxurious fabrics, and signature silhouettes.',
                'image'    => 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=85',
                'cta_text' => 'Shop Collection',
                'cta_link' => '/shop?sort=latest',
                'badge'    => 'Autumn / Winter 2026',
                'sort_order' => 0,
            ],
            [
                'title'    => 'Handcrafted Premium Leather',
                'subtitle' => 'Full-grain genuine leather footwear, belts, and luxury wallets.',
                'image'    => 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1600&auto=format&fit=crop&q=85',
                'cta_text' => 'Explore Leather',
                'cta_link' => '/category/accessories-bags',
                'badge'    => 'Craftsmanship',
                'sort_order' => 1,
            ],
            [
                'title'    => 'Exclusive Women\'s Festive Edit',
                'subtitle' => 'Handloom sarees, embroidered kurtis, and statement accessories.',
                'image'    => 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1600&auto=format&fit=crop&q=85',
                'cta_text' => 'Shop Women\'s',
                'cta_link' => '/category/womens-collection',
                'badge'    => 'Festive Season',
                'sort_order' => 2,
            ],
        ];

        Banner::where('store_id', $store->id)->delete();

        foreach ($banners as $banner) {
            Banner::create(array_merge($banner, [
                'store_id'  => $store->id,
                'is_active' => true,
            ]));
        }

        $this->command->info('✅ Banners seeded: ' . count($banners));
    }
}
