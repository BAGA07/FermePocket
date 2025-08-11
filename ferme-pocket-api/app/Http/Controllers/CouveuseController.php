<?php

namespace App\Http\Controllers;

use App\Models\Couveuse;
use App\Models\LotsCouveuse;
use App\Models\ReleveCouveuse;
use Illuminate\Http\Request;
use Carbon\Carbon;

class CouveuseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Couveuse::with(['lots' => function ($query) {
            $query->where('statut', 'en_cours');
        }, 'releves' => function ($query) {
            $query->latest('date_releve')->limit(1);
        }])->get()->map(function ($couveuse) {
            return [
                'id' => $couveuse->id,
                'nom' => $couveuse->nom,
                'capacite' => $couveuse->capacite,
                'type' => $couveuse->type,
                'statut' => $couveuse->statut,
                'occupation_actuelle' => $couveuse->occupationActuelle,
                'taux_occupation' => $couveuse->tauxOccupation,
                'temperature_actuelle' => $couveuse->temperatureActuelle,
                'humidite_actuelle' => $couveuse->humiditeActuelle,
                'lots_actifs' => $couveuse->lotsActifs,
                'dernier_releve' => $couveuse->dernierReleve,
            ];
        });
    }

    /**
     * Obtenir les statistiques du dashboard
     */
    public function dashboard()
    {
        $couveuses = Couveuse::with(['lots', 'releves'])->get();
        $lots = LotsCouveuse::all();

        $statistiques = [
            'total_couveuses' => $couveuses->count(),
            'couveuses_actives' => $couveuses->where('statut', 'active')->count(),
            'total_lots' => $lots->count(),
            'lots_actifs' => $lots->where('statut', 'en_cours')->count(),
            'lots_termines' => $lots->where('statut', 'termine')->count(),
            'total_oeufs' => $lots->where('statut', 'en_cours')->sum('nb_oeufs'),
            'oeufs_eclos' => $lots->where('statut', 'termine')->sum('nb_eclos'),
            'taux_reussite' => $lots->where('statut', 'termine')->count() > 0
                ? round(($lots->where('statut', 'termine')->sum('nb_eclos') / $lots->where('statut', 'termine')->sum('nb_oeufs')) * 100, 1)
                : 0
        ];

        $couveuses_data = $couveuses->map(function ($couveuse) {
            return [
                'id' => $couveuse->id,
                'nom' => $couveuse->nom,
                'statut' => $couveuse->statut,
                'capacite' => $couveuse->capacite,
                'occupation' => $couveuse->occupationActuelle,
                'taux_occupation' => $couveuse->tauxOccupation,
                'temperature' => $couveuse->temperatureActuelle,
                'humidite' => $couveuse->humiditeActuelle,
                'lots_actifs' => $couveuse->lotsActifs
            ];
        });

        return response()->json([
            'statistiques' => $statistiques,
            'couveuses' => $couveuses_data,
            'evolution' => $this->getEvolutionData(),
            'alertes' => $this->getAlertes()
        ]);
    }

    /**
     * Obtenir les données d'évolution des 7 derniers jours
     */
    private function getEvolutionData()
    {
        $dates = collect();
        $temperatures = collect();
        $humidites = collect();

        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $dates->push($date->format('d/m'));

            $releves = ReleveCouveuse::whereDate('date_releve', $date)->get();

            $temperatures->push($releves->count() > 0 ? round($releves->avg('temperature'), 1) : null);
            $humidites->push($releves->count() > 0 ? round($releves->avg('humidite'), 1) : null);
        }

        return [
            'dates' => $dates,
            'temperature' => $temperatures,
            'humidite' => $humidites
        ];
    }

    /**
     * Obtenir les alertes actuelles
     */
    private function getAlertes()
    {
        $alertes = collect();
        $couveuses = Couveuse::with('releves')->where('statut', 'active')->get();

        foreach ($couveuses as $couveuse) {
            $dernierReleve = $couveuse->releves()->latest('date_releve')->first();

            if ($dernierReleve) {
                // Alerte température
                if ($dernierReleve->temperature > 38.0) {
                    $alertes->push([
                        'id' => 'temp_' . $couveuse->id,
                        'type' => 'warning',
                        'message' => 'Température élevée ' . $couveuse->nom,
                        'couveuse' => $couveuse->nom,
                        'valeur' => $dernierReleve->temperature . '°C',
                        'seuil' => '38.0°C',
                        'date' => $dernierReleve->date_releve
                    ]);
                } elseif ($dernierReleve->temperature < 36.5) {
                    $alertes->push([
                        'id' => 'temp_low_' . $couveuse->id,
                        'type' => 'warning',
                        'message' => 'Température basse ' . $couveuse->nom,
                        'couveuse' => $couveuse->nom,
                        'valeur' => $dernierReleve->temperature . '°C',
                        'seuil' => '36.5°C',
                        'date' => $dernierReleve->date_releve
                    ]);
                }

                // Alerte humidité
                if ($dernierReleve->humidite > 65) {
                    $alertes->push([
                        'id' => 'hum_' . $couveuse->id,
                        'type' => 'info',
                        'message' => 'Humidité élevée ' . $couveuse->nom,
                        'couveuse' => $couveuse->nom,
                        'valeur' => $dernierReleve->humidite . '%',
                        'seuil' => '65%',
                        'date' => $dernierReleve->date_releve
                    ]);
                } elseif ($dernierReleve->humidite < 45) {
                    $alertes->push([
                        'id' => 'hum_low_' . $couveuse->id,
                        'type' => 'info',
                        'message' => 'Humidité basse ' . $couveuse->nom,
                        'couveuse' => $couveuse->nom,
                        'valeur' => $dernierReleve->humidite . '%',
                        'seuil' => '45%',
                        'date' => $dernierReleve->date_releve
                    ]);
                }
            }
        }

        return $alertes->take(10); // Limiter à 10 alertes
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string|max:255',
            'capacite' => 'required|integer',
            'type' => 'required|in:manuelle,automatique',
            'statut' => 'required|in:active,inactive'
        ]);
        return Couveuse::create($data);
    }

    public function show(Couveuse $couveuse)
    {
        return $couveuse->load(['lots', 'releves' => function ($query) {
            $query->orderBy('date_releve', 'desc')->limit(20);
        }]);
    }

    public function update(Request $request, Couveuse $couveuse)
    {
        $data = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'capacite' => 'sometimes|integer',
            'type' => 'sometimes|in:manuelle,automatique',
            'statut' => 'sometimes|in:active,inactive'
        ]);

        $couveuse->update($data);
        return $couveuse;
    }

    public function destroy(Couveuse $couveuse)
    {
        $couveuse->delete();
        return response()->json(['message' => 'Supprimé avec succès']);
    }
}