<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ReleveCouveuse;
use App\Models\Couveuse;
use Faker\Factory as Faker;
use Carbon\Carbon;

class ReleveCouveuseSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        $couveuses = Couveuse::where('statut', 'active')->get();

        foreach ($couveuses as $couveuse) {
            // Générer des relevés pour les 7 derniers jours (plusieurs par jour)
            for ($day = 6; $day >= 0; $day--) {
                $date = Carbon::now()->subDays($day);

                // 4 relevés par jour (toutes les 6h)
                for ($hour = 0; $hour < 24; $hour += 6) {
                    $dateReleve = $date->copy()->setHour($hour)->setMinute($faker->numberBetween(0, 59));

                    // Température optimale avec variations réalistes
                    $tempBase = 37.5;
                    $tempVariation = $faker->randomFloat(1, -0.8, 0.8);
                    $temperature = round($tempBase + $tempVariation, 1);

                    // Humidité optimale avec variations
                    $humBase = 55;
                    $humVariation = $faker->randomFloat(1, -10, 10);
                    $humidite = round($humBase + $humVariation, 1);

                    ReleveCouveuse::create([
                        'couveuse_id' => $couveuse->id,
                        'temperature' => $temperature,
                        'humidite' => $humidite,
                        'date_releve' => $dateReleve,
                        'tenant_id' => 1, // Assuming tenant IDs are between 1 and 5
                    ]);
                }
            }
        }
    }
}
