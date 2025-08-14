<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LotCouveuse;
use App\Models\Couveuse;
use App\Models\LotsCouveuse;
use Faker\Factory as Faker;
use Carbon\Carbon;

class LotCouveuseSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        $couveuses = Couveuse::all();

        foreach ($couveuses as $couveuse) {
            // Nombre de lots selon le statut de la couveuse
            $nbLots = $couveuse->statut === 'active' ? $faker->numberBetween(1, 3) : 0;

            for ($i = 0; $i < $nbLots; $i++) {
                $nbOeufs = $faker->numberBetween(
                    (int)($couveuse->capacite * 0.3),
                    (int)($couveuse->capacite * 0.9)
                );

                $dateDebut = $faker->dateTimeBetween('-2 months', '-1 week');
                $dateEclosionPrevue = Carbon::parse($dateDebut)->addDays(21); // 21 jours d'incubation

                // Déterminer le statut selon la date
                $statut = Carbon::now()->gte($dateEclosionPrevue) ? 'termine' : 'en_cours';

                // Si terminé, calculer le nombre d'éclos
                $nbEclos = 0;
                if ($statut === 'termine') {
                    $tauxReussite = $faker->randomFloat(2, 0.65, 0.90); // 65% à 90% de réussite
                    $nbEclos = (int)($nbOeufs * $tauxReussite);
                }

                LotsCouveuse::create([
                    'couveuse_id' => $couveuse->id,
                    'code_lot' => strtoupper($faker->bothify('LOT-###??')),
                    'nb_oeufs' => $nbOeufs,
                    'date_debut' => $dateDebut,
                    'date_eclosion_prevue' => $dateEclosionPrevue,
                    'nb_eclos' => $nbEclos,
                    'statut' => $statut,
                    'tenant_id' => 1, // Assuming tenant_id is set on couveuses
                ]);
            }
        }
    }
}
