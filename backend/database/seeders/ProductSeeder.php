<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Store;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $store = Store::where('slug', 'ligglo-fashion-zone')->firstOrFail();

        // Helper closures
        $cat   = fn($slug) => Category::where('store_id', $store->id)->where('slug', $slug)->first();
        $brand = fn($slug) => Brand::where('store_id', $store->id)->where('slug', $slug)->first();

        $products = [
            [
                'name'          => 'Classic Supima Cotton Oxford Shirt',
                'slug'          => 'classic-supima-cotton-oxford-shirt',
                'category_slug' => 'mens-fashion',
                'brand_slug'    => 'apex-artisan',
                'thumbnail'     => 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
                'selling_price' => 2200,
                'discount_price'=> 1850,
                'stock'         => 27,
                'rating'        => 4.9,
                'review_count'  => 28,
                'is_featured'   => true,
                'is_new_arrival'=> false,
                'description'   => 'Crafted from 100% long-staple Supima cotton for unmatched softness, durability, and natural breathability. Designed with a button-down collar, box pleat, and mother-of-pearl buttons.',
                'images' => [
                    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&auto=format&fit=crop&q=80',
                ],
                'variants' => [
                    ['name'=>'Size','value'=>'M','sku'=>'OXF-WHT-M','stock'=>6],
                    ['name'=>'Size','value'=>'L','sku'=>'OXF-WHT-L','stock'=>4],
                    ['name'=>'Size','value'=>'XL','sku'=>'OXF-WHT-XL','stock'=>3],
                    ['name'=>'Color','value'=>'Classic White','sku'=>null,'stock'=>10],
                    ['name'=>'Color','value'=>'Sky Blue','sku'=>null,'stock'=>7],
                    ['name'=>'Color','value'=>'Navy Blue','sku'=>null,'stock'=>7],
                ],
            ],
            [
                'name'          => 'Handcrafted Heritage Penny Loafer',
                'slug'          => 'handcrafted-heritage-penny-loafer',
                'category_slug' => 'footwear',
                'brand_slug'    => 'terra-sole',
                'thumbnail'     => 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80',
                'selling_price' => 4500,
                'discount_price'=> null,
                'stock'         => 12,
                'rating'        => 4.8,
                'review_count'  => 19,
                'is_featured'   => true,
                'is_new_arrival'=> false,
                'description'   => 'Constructed with supple full-grain crust calf leather and Goodyear welted sole. Padded leather insole ensures all-day comfort for formal and smart-casual occasions.',
                'images' => [
                    'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80',
                ],
                'variants' => [
                    ['name'=>'Size','value'=>'41','sku'=>'LOAF-BRN-41','stock'=>4],
                    ['name'=>'Size','value'=>'42','sku'=>'LOAF-BRN-42','stock'=>5],
                    ['name'=>'Color','value'=>'Tan Brown','sku'=>null,'stock'=>9],
                    ['name'=>'Color','value'=>'Deep Black','sku'=>null,'stock'=>3],
                ],
            ],
            [
                'name'          => 'Minimalist Full-Grain Leather Bi-Fold Wallet',
                'slug'          => 'minimalist-leather-bifold-wallet',
                'category_slug' => 'accessories-bags',
                'brand_slug'    => 'apex-artisan',
                'thumbnail'     => 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
                'selling_price' => 1450,
                'discount_price'=> 1150,
                'stock'         => 20,
                'rating'        => 4.7,
                'review_count'  => 42,
                'is_featured'   => true,
                'is_new_arrival'=> true,
                'description'   => 'Slim profile RFID-blocking wallet made from vegetable-tanned genuine leather. Features 8 dedicated card slots, 2 hidden slip pockets, and full-length cash compartment.',
                'images' => [
                    'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
                ],
                'variants' => [
                    ['name'=>'Color','value'=>'Vintage Saddle','sku'=>'WAL-SDL','stock'=>12],
                    ['name'=>'Color','value'=>'Matte Charcoal','sku'=>'WAL-CHR','stock'=>8],
                ],
            ],
            [
                'name'          => 'Pure Egyptian Cotton Festive Panjabi',
                'slug'          => 'pure-egyptian-cotton-festive-panjabi',
                'category_slug' => 'mens-fashion',
                'brand_slug'    => 'loom-craft',
                'thumbnail'     => 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
                'selling_price' => 3500,
                'discount_price'=> 2950,
                'stock'         => 13,
                'rating'        => 5.0,
                'review_count'  => 14,
                'is_featured'   => true,
                'is_new_arrival'=> true,
                'description'   => 'Luxurious Egyptian Giza cotton with subtle tone-on-tone embroidery around the collar and placket. Designed for Eid and celebratory occasions.',
                'images' => [
                    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
                ],
                'variants' => [
                    ['name'=>'Size','value'=>'40','sku'=>'PAN-EMR-40','stock'=>5],
                    ['name'=>'Size','value'=>'42','sku'=>'PAN-EMR-42','stock'=>2],
                    ['name'=>'Color','value'=>'Emerald Forest','sku'=>null,'stock'=>7],
                    ['name'=>'Color','value'=>'Pearl White','sku'=>null,'stock'=>6],
                ],
            ],
            [
                'name'          => 'Embroidered Silk Chiffon Kurti Set',
                'slug'          => 'embroidered-silk-chiffon-kurti-set',
                'category_slug' => 'womens-collection',
                'brand_slug'    => 'velvet-luxe',
                'thumbnail'     => 'https://images.unsplash.com/photo-1583391733975-226e6d1c4a0f?w=800&auto=format&fit=crop&q=80',
                'selling_price' => 3800,
                'discount_price'=> 3200,
                'stock'         => 7,
                'rating'        => 4.6,
                'review_count'  => 22,
                'is_featured'   => false,
                'is_new_arrival'=> true,
                'description'   => 'Flowy, lightweight silhouette adorned with handcrafted zari work along the neckline and sleeves. Includes matching cigarette trousers.',
                'images' => [
                    'https://images.unsplash.com/photo-1583391733975-226e6d1c4a0f?w=800&auto=format&fit=crop&q=80',
                ],
                'variants' => [
                    ['name'=>'Size','value'=>'M','sku'=>'KUR-LIL-M','stock'=>3],
                    ['name'=>'Color','value'=>'Pastel Lilac','sku'=>null,'stock'=>3],
                    ['name'=>'Color','value'=>'Sage Green','sku'=>null,'stock'=>4],
                ],
            ],
            [
                'name'          => 'Heavyweight 280 GSM Oversized Tee',
                'slug'          => 'heavyweight-oversized-tee',
                'category_slug' => 'mens-fashion',
                'brand_slug'    => 'urban-edge',
                'thumbnail'     => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
                'selling_price' => 950,
                'discount_price'=> null,
                'stock'         => 18,
                'rating'        => 4.8,
                'review_count'  => 53,
                'is_featured'   => false,
                'is_new_arrival'=> true,
                'description'   => 'Modern boxy cut made with 100% comb-spun combed cotton. High-density ribbed collar that maintains structure wash after wash.',
                'images' => [
                    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
                ],
                'variants' => [
                    ['name'=>'Size','value'=>'L','sku'=>'TEE-OLV-L','stock'=>10],
                    ['name'=>'Color','value'=>'Washed Olive','sku'=>null,'stock'=>10],
                    ['name'=>'Color','value'=>'Faded Black','sku'=>null,'stock'=>8],
                ],
            ],
            [
                'name'          => 'Structured Italian Leather Tote Bag',
                'slug'          => 'structured-italian-leather-tote',
                'category_slug' => 'accessories-bags',
                'brand_slug'    => 'velvet-luxe',
                'thumbnail'     => 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
                'selling_price' => 4200,
                'discount_price'=> 3600,
                'stock'         => 8,
                'rating'        => 4.9,
                'review_count'  => 16,
                'is_featured'   => true,
                'is_new_arrival'=> false,
                'description'   => 'Spacious everyday work tote fits up to 14-inch laptops. Crafted from pebbled scratch-resistant leather with brushed gold hardware.',
                'images' => [
                    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
                ],
                'variants' => [
                    ['name'=>'Color','value'=>'Caramel Tan','sku'=>'TOT-TAN','stock'=>3],
                    ['name'=>'Color','value'=>'Midnight Black','sku'=>'TOT-BLK','stock'=>5],
                ],
            ],
            [
                'name'          => 'Classic Retro Runner Sneakers',
                'slug'          => 'classic-retro-runner-sneakers',
                'category_slug' => 'footwear',
                'brand_slug'    => 'urban-edge',
                'thumbnail'     => 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
                'selling_price' => 3200,
                'discount_price'=> null,
                'stock'         => 0,
                'rating'        => 4.5,
                'review_count'  => 9,
                'is_featured'   => false,
                'is_new_arrival'=> false,
                'in_stock'      => false,
                'description'   => 'Vintage aesthetics paired with modern EVA cushioning and grippy gum rubber outsoles. Suede leather overlays provide texture and durability.',
                'images' => [
                    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
                ],
                'variants' => [
                    ['name'=>'Size','value'=>'41','sku'=>'SNK-WHT-41','stock'=>0,'in_stock'=>false],
                ],
            ],
        ];

        foreach ($products as $i => $data) {
            $categoryModel = $cat($data['category_slug']);
            $brandModel    = $brand($data['brand_slug']);

            $product = Product::updateOrCreate(
                ['store_id' => $store->id, 'slug' => $data['slug']],
                [
                    'store_id'       => $store->id,
                    'category_id'    => $categoryModel?->id,
                    'brand_id'       => $brandModel?->id,
                    'name'           => $data['name'],
                    'description'    => $data['description'],
                    'selling_price'  => $data['selling_price'],
                    'discount_price' => $data['discount_price'],
                    'regular_price'  => $data['selling_price'],
                    'stock'          => $data['stock'],
                    'in_stock'       => ($data['in_stock'] ?? true) && $data['stock'] > 0,
                    'thumbnail'      => $data['thumbnail'],
                    'rating'         => $data['rating'],
                    'review_count'   => $data['review_count'],
                    'is_featured'    => $data['is_featured'],
                    'is_new_arrival' => $data['is_new_arrival'],
                    'is_active'      => true,
                    'sort_order'     => $i,
                ]
            );

            // Images
            $product->images()->delete();
            foreach ($data['images'] as $j => $url) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'url'        => $url,
                    'is_primary' => $j === 0,
                    'sort_order' => $j,
                ]);
            }

            // Variants
            $product->variants()->delete();
            foreach ($data['variants'] as $k => $v) {
                ProductVariant::create([
                    'product_id'       => $product->id,
                    'name'             => $v['name'],
                    'value'            => $v['value'],
                    'sku'              => $v['sku'] ?? null,
                    'stock'            => $v['stock'],
                    'in_stock'         => ($v['in_stock'] ?? true) && $v['stock'] > 0,
                    'price_adjustment' => 0,
                    'sort_order'       => $k,
                ]);
            }
        }

        $this->command->info('✅ Products seeded: ' . count($products));
    }
}
