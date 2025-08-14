<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Client;
use Faker\Factory as Faker;

class ClientSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        for ($i = 0; $i < 8; $i++) {
            Client::create([
                'nom' => $faker->company(),
                'telephone' => $faker->phoneNumber(),
                'email' => $faker->companyEmail(),
                'adresse' => $faker->address(),
                'tenant_id' => 1, // Assuming tenant IDs are between 1 and 5
            ]);
        }
    }
}
