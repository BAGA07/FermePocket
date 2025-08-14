<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Alerte;
use Faker\Factory as Faker;

class AlerteSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $types = ['Stock bas', 'Température anormale', 'Humidité anormale', 'Maladie détectée'];

        for ($i = 0; $i < 10; $i++) {
            Alerte::create([
                'type' => $faker->randomElement($types),
                'message' => $faker->sentence(),
                'statut' => $faker->randomElement(['vue', 'non_vue']),
                'tenant_id' => 1, // Assuming tenant IDs are between 1 and 5
            ]);
        }
    }
}
