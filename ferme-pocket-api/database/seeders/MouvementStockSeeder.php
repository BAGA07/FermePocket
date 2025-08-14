<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MouvementStock;
use App\Models\StockAliment;
use Faker\Factory as Faker;

class MouvementStockSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        $stocks = StockAliment::all();

        foreach ($stocks as $stock) {
            for ($i = 0; $i < 5; $i++) {
                MouvementStock::create([
                    'stock_id' => $stock->id,
                    'type' => $faker->randomElement(['entree', 'sortie']),
                    'quantite' => $faker->randomFloat(1, 5, 50),
                    'raison' => $faker->sentence(),
                    'date_mouvement' => $faker->dateTimeBetween('-1 month', 'now'),
                    'tenant_id' => 1, // Assuming tenant IDs are between 1 and 5
                ]);
            }
        }
    }
}
