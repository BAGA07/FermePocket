<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Couveuse;

class CouveuseSeeder extends Seeder
{
    public function run(): void
    {
        $couveuses = [
            [
                'nom' => 'Couveuse Pro 500',
                'capacite' => 500,
                'type' => 'automatique',
                'statut' => 'active',
                'tenant_id' => 1,
            ],
            [
                'nom' => 'Couveuse Manuelle 200',
                'capacite' => 200,
                'type' => 'manuelle',
                'statut' => 'active',
                'tenant_id' => 1,
            ],
            [
                'nom' => 'Couveuse Premium 1000',
                'capacite' => 1000,
                'type' => 'automatique',
                'statut' => 'active',
                'tenant_id' => 1,
            ],
            [
                'nom' => 'Couveuse Compact 150',
                'capacite' => 150,
                'type' => 'manuelle',
                'statut' => 'inactive',
                'tenant_id' => 1
            ],
            [
                'nom' => 'Couveuse Industrielle 2000',
                'capacite' => 2000,
                'type' => 'automatique',
                'statut' => 'active',
                'tenant_id' => 1,
            ]
        ];

        foreach ($couveuses as $couveuse) {
            Couveuse::create($couveuse);
        }
    }
}
