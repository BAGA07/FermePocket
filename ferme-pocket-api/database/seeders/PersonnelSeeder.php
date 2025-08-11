<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Personnel;
use Faker\Factory as Faker;

class PersonnelSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $postes = ['Ouvrier avicole', 'Technicien couveuse', 'Magasinier', 'Vétérinaire adjoint'];

        for ($i = 0; $i < 5; $i++) {
            Personnel::create([
                'nom' => $faker->name(),
                'poste' => $faker->randomElement($postes),
                'salaire' => $faker->randomFloat(0, 50000, 150000),
                'telephone' => $faker->phoneNumber(),
                'date_embauche' => $faker->dateTimeBetween('-2 years', 'now'),
                'statut' => $faker->randomElement(['actif', 'inactif']),
            ]);
        }
    }
}