<?php

/**
 * Script de test pour l'API des couveuses
 * Exécuter avec : php test_api.php
 */

require_once 'vendor/autoload.php';

use App\Models\Couveuse;
use App\Models\LotsCouveuse;
use App\Models\ReleveCouveuse;

// Simuler l'environnement Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Test de l'API Couveuses ===\n\n";

try {
    // Test 1: Récupérer toutes les couveuses
    echo "1. Test récupération des couveuses:\n";
    $couveuses = Couveuse::with(['lots', 'releves'])->get();
    echo "   Nombre de couveuses: " . $couveuses->count() . "\n";
    
    foreach ($couveuses as $couveuse) {
        echo "   - {$couveuse->nom} ({$couveuse->statut}): {$couveuse->occupationActuelle}/{$couveuse->capacite} œufs\n";
        echo "     Température: " . ($couveuse->temperatureActuelle ?? 'N/A') . "°C, ";
        echo "Humidité: " . ($couveuse->humiditeActuelle ?? 'N/A') . "%\n";
    }
    echo "\n";

    // Test 2: Statistiques du dashboard
    echo "2. Test statistiques dashboard:\n";
    $lots = LotsCouveuse::all();
    $statistiques = [
        'total_couveuses' => $couveuses->count(),
        'couveuses_actives' => $couveuses->where('statut', 'active')->count(),
        'total_lots' => $lots->count(),
        'lots_actifs' => $lots->where('statut', 'en_cours')->count(),
        'lots_termines' => $lots->where('statut', 'termine')->count(),
        'total_oeufs' => $lots->where('statut', 'en_cours')->sum('nb_oeufs'),
        'oeufs_eclos' => $lots->where('statut', 'termine')->sum('nb_eclos'),
    ];
    
    $statistiques['taux_reussite'] = $lots->where('statut', 'termine')->count() > 0 
        ? round(($lots->where('statut', 'termine')->sum('nb_eclos') / $lots->where('statut', 'termine')->sum('nb_oeufs')) * 100, 1)
        : 0;

    foreach ($statistiques as $key => $value) {
        echo "   {$key}: {$value}\n";
    }
    echo "\n";

    // Test 3: Relevés récents
    echo "3. Test relevés récents:\n";
    $relevesRecents = ReleveCouveuse::with('couveuse')
        ->orderBy('date_releve', 'desc')
        ->limit(5)
        ->get();
    
    foreach ($relevesRecents as $releve) {
        echo "   {$releve->couveuse->nom}: {$releve->temperature}°C, {$releve->humidite}% - {$releve->date_releve}\n";
    }
    echo "\n";

    // Test 4: Alertes
    echo "4. Test génération d'alertes:\n";
    $alertes = collect();
    $couveusesActives = Couveuse::with('releves')->where('statut', 'active')->get();

    foreach ($couveusesActives as $couveuse) {
        $dernierReleve = $couveuse->releves()->latest('date_releve')->first();
        
        if ($dernierReleve) {
            if ($dernierReleve->temperature > 38.0) {
                $alertes->push("⚠️  Température élevée {$couveuse->nom}: {$dernierReleve->temperature}°C");
            } elseif ($dernierReleve->temperature < 36.5) {
                $alertes->push("⚠️  Température basse {$couveuse->nom}: {$dernierReleve->temperature}°C");
            }

            if ($dernierReleve->humidite > 65) {
                $alertes->push("ℹ️  Humidité élevée {$couveuse->nom}: {$dernierReleve->humidite}%");
            } elseif ($dernierReleve->humidite < 45) {
                $alertes->push("ℹ️  Humidité basse {$couveuse->nom}: {$dernierReleve->humidite}%");
            }
        }
    }

    if ($alertes->count() > 0) {
        foreach ($alertes as $alerte) {
            echo "   {$alerte}\n";
        }
    } else {
        echo "   ✅ Aucune alerte détectée\n";
    }

    echo "\n=== Tests terminés avec succès ! ===\n";

} catch (Exception $e) {
    echo "❌ Erreur lors des tests: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
