<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Facture;
use App\Models\Client;
use Faker\Factory as Faker;

class FactureSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        $clients = Client::all();

        foreach ($clients as $client) {
            for ($i = 0; $i < 3; $i++) {
                Facture::create([
                    'client_id' => $client->id,
                    'date' => $faker->dateTimeBetween('-6 months', 'now'),
                    'montant_total' => $faker->randomFloat(2, 10000, 150000),
                    'statut' => $faker->randomElement(['payee', 'impayee', 'partiel']),
                ]);
            }
        }
    }
}