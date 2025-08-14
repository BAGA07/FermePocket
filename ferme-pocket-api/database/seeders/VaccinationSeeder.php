<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vaccination;
use App\Models\LotVolaille;
use Faker\Factory as Faker;

class VaccinationSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        $lots = LotVolaille::all();

        foreach ($lots as $lot) {
            for ($i = 0; $i < 2; $i++) {
                Vaccination::create([
                    'lot_id' => $lot->id,
                    'nom_vaccin' => $faker->randomElement(['Newcastle', 'Gumboro', 'Bronchite infectieuse']),
                    'date' => $faker->dateTimeBetween('-6 months', 'now'),
                    'remarques' => $faker->sentence(),
                    'tenant_id' => 1, // Assuming tenant IDs are between 1 and 5
                ]);
            }
        }
    }
}
