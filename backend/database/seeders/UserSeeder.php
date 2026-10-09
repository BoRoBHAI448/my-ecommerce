<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@ligglo.com'],
            [
                'name'      => 'Ligglo Admin',
                'password'  => Hash::make('ligglo@1234'),
                'role'      => 'admin',
                'phone'     => '01700000000',
                'is_active' => true,
            ]
        );
    }
}
