<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LigneFacture;
use App\Models\Facture;
use Faker\Factory as Faker;

class LigneFactureSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        $factures = Facture::all();

        foreach ($factures as $facture) {
            for ($i = 0; $i < $faker->numberBetween(1, 4); $i++) {

                // Calcul des valeurs avant insertion
                $qte = $faker->numberBetween(1, 50);
                $pu = $faker->randomFloat(2, 500, 3000);
                $total = $qte * $pu;

                LigneFacture::create([
                    'facture_id'   => $facture->id,
                    'produit'      => $faker->randomElement(['Œufs', 'Poulets chair', 'Poules pondeuses']),
                    'quantite'     => $qte,
                    'prix_unitaire' => $pu,
                    'prix_total'   => $total,
                    'tenant_id'    => 1, // Assumes tenant_id is set in Facture model
                ]);
            }
        }
    }
}
