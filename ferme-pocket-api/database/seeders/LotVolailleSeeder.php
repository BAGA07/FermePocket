<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LotVolaille;
use Faker\Factory as Faker;

class LotVolailleSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        for ($i = 0; $i < 5; $i++) {
            LotVolaille::create([
                'type' => $faker->randomElement(['pondeuse', 'chair']),
                'quantite' => $faker->numberBetween(50, 500),
                'date_debut' => $faker->dateTimeBetween('-6 months', 'now'),
                'poids_moyen' => $faker->randomFloat(2, 1.5, 3.0),
                'statut' => $faker->randomElement(['actif', 'vendu', 'perdu']),
            ]);
        }
    }
}