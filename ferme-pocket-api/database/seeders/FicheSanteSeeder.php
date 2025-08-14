<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FicheSante;
use App\Models\LotVolaille;
use App\Models\User;
use Faker\Factory as Faker;

class FicheSanteSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        $lots = LotVolaille::all();
        $vets = User::where('role', 'veterinaire')->pluck('id');

        foreach ($lots as $lot) {
            for ($i = 0; $i < 2; $i++) {
                FicheSante::create([
                    'lot_id' => $lot->id,
                    'maladie' => $faker->randomElement(['Coccidiose', 'Grippe aviaire', 'Salmonellose']),
                    'symptomes' => $faker->sentence(),
                    'traitement' => $faker->sentence(),
                    'date' => $faker->dateTimeBetween('-3 months', 'now'),
                    'veterinaire_id' => $faker->randomElement($vets->toArray()),
                    'tenant_id' => 1, // Assuming tenant IDs are between 1 and 5
                ]);
            }
        }
    }
}
