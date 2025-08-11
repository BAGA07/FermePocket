<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StockAliment;
use Faker\Factory as Faker;

class StockAlimentSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $aliments = [
            ['nom' => 'Maïs concassé', 'unite' => 'kg'],
            ['nom' => 'Tourteau de soja', 'unite' => 'kg'],
            ['nom' => 'Blé entier', 'unite' => 'kg'],
            ['nom' => 'Mélange minéral', 'unite' => 'kg']
        ];

        foreach ($aliments as $aliment) {
            StockAliment::create([
                'nom' => $aliment['nom'],
                'unite' => $aliment['unite'],
                'quantite' => $faker->randomFloat(1, 50, 500),
                'seuil_alerte' => $faker->randomFloat(1, 10, 50)
            ]);
        }
    }
}