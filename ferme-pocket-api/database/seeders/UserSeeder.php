<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'name' => 'Admin Principal',
            'email' => 'admin@fermepocket.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'telephone' => '+22370000001',
            //'tenant_id' => 1, // Assuming tenant IDs are between 1 and 5
        ]);

        // Employés
        User::factory()->count(5)->create([
            'role' => 'employe'
        ]);

        // Vétérinaires
        User::factory()->count(2)->create([
            'role' => 'veterinaire'
        ]);
    }
}
