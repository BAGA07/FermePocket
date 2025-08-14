<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            TenantSeeder::class,
            UserSeeder::class,
            CouveuseSeeder::class,
            LotCouveuseSeeder::class,
            ReleveCouveuseSeeder::class,
            StockAlimentSeeder::class,
            MouvementStockSeeder::class,
            LotVolailleSeeder::class,
            FicheSanteSeeder::class,
            VaccinationSeeder::class,
            PersonnelSeeder::class,
            PresenceSeeder::class,
            ClientSeeder::class,
            FactureSeeder::class,
            LigneFactureSeeder::class,
            AlerteSeeder::class,
        ]);
    }
}
