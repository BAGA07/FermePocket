<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Presence;
use App\Models\Personnel;
use Faker\Factory as Faker;

class PresenceSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        $personnels = Personnel::all();

        foreach ($personnels as $perso) {
            for ($i = 0; $i < 15; $i++) {
                Presence::create([
                    'personnel_id' => $perso->id,
                    'date' => $faker->dateTimeBetween('-1 month', 'now'),
                    'statut' => $faker->randomElement(['present', 'absent', 'conge']),
                ]);
            }
        }
    }
}