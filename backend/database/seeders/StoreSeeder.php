<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Store;

class StoreSeeder extends Seeder
{
    public function run(): void
    {
        Store::updateOrCreate(
            ['slug' => 'ligglo-fashion-zone'],
            [
                'name'     => 'ligglo Fashion Zone',
                'domain'   => null, // set to real domain when deployed
                'tagline'  => 'Premium Everyday Essentials & Lifestyle',
                'logo'     => '/logo.png',
                'favicon'  => '/favicon.ico',
                'currency' => 'BDT',
                'currency_symbol' => '৳',
                'colors'   => [
                    'primary'          => '#0f172a',
                    'primary_contrast' => '#ffffff',
                    'secondary'        => '#f59e0b',
                    'secondary_contrast' => '#ffffff',
                ],
                'contact'  => [
                    'phone'   => '+880 1711-223344',
                    'email'   => 'support@ligglofashion.com',
                    'address' => 'House 42, Road 11, Banani, Dhaka-1213, Bangladesh',
                    'hours'   => '9:00 AM - 10:00 PM (Daily)',
                ],
                'social'   => [
                    'facebook'  => 'https://facebook.com/ligglofashion',
                    'instagram' => 'https://instagram.com/ligglofashion',
                    'youtube'   => '',
                ],
                'whatsapp'             => '8801711223344',
                'announcement_enabled' => true,
                'announcement_text'    => '🎉 Free Delivery inside Dhaka on orders above ৳2,000!',
                'delivery_inside_dhaka'  => 70,
                'delivery_sub_dhaka'     => 100,
                'delivery_outside_dhaka' => 130,
                'free_delivery_threshold' => 2000,
                'is_active' => true,
            ]
        );

        $this->command->info('✅ Store seeded: ligglo Fashion Zone');
    }
}
