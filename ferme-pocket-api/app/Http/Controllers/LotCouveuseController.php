<?php

namespace App\Http\Controllers;

use App\Models\LotsCouveuse;
use App\Models\Couveuse;
use Illuminate\Http\Request;
use Carbon\Carbon;

class LotCouveuseController extends Controller
{
    /**
     * Récupérer tous les lots avec leurs couveuses
     */
    public function index()
    {
        try {
            $lots = LotsCouveuse::with('couveuse')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($lot) {
                    return [
                        'id' => $lot->id,
                        'code_lot' => $lot->code_lot,
                        'couveuse' => $lot->couveuse->nom ?? 'N/A',
                        'couveuse_id' => $lot->couveuse_id,
                        'nb_oeufs' => $lot->nb_oeufs,
                        'date_debut' => $lot->date_debut->format('Y-m-d'),
                        'date_eclosion_prevue' => $lot->date_eclosion_prevue->format('Y-m-d'),
                        'date_eclosion_reelle' => $lot->date_eclosion_reelle?->format('Y-m-d'),
                        'nb_eclos' => $lot->nb_eclos,
                        'statut' => $lot->statut,
                        'taux_reussite' => $lot->taux_reussite,
                        'jours_restants' => $lot->jours_restants,
                        'progression' => $lot->progression,
                        'created_at' => $lot->created_at
                    ];
                });

            return response()->json([
                'status' => 'success',
                'data' => $lots
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la récupération des lots',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Créer un nouveau lot avec validation avancée
     */
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'couveuse_id' => 'required|exists:couveuses,id',
                'code_lot' => 'required|string|max:50|unique:lots_couveuses,code_lot',
                'nb_oeufs' => 'required|integer|min:1|max:1000',
                'date_debut' => 'required|date|after_or_equal:today',
                'duree_incubation' => 'required|integer|min:15|max:35', // Durée en jours
                'type_oeuf' => 'nullable|string|max:50',
                'notes' => 'nullable|string|max:500'
            ]);

            // Vérifier la disponibilité de la couveuse
            $couveuse = Couveuse::find($data['couveuse_id']);
            if (!$couveuse) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Couveuse introuvable'
                ], 404);
            }

            // Vérifier la capacité de la couveuse
            $lotsActifs = LotsCouveuse::where('couveuse_id', $data['couveuse_id'])
                ->where('statut', 'en_cours')
                ->sum('nb_oeufs');

            if (($lotsActifs + $data['nb_oeufs']) > $couveuse->capacite) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Capacité de la couveuse dépassée. Capacité disponible: ' . ($couveuse->capacite - $lotsActifs) . ' œufs'
                ], 400);
            }

            // Calculer la date d'éclosion prévue
            $dateDebut = Carbon::parse($data['date_debut']);
            $dateEclosionPrevue = $dateDebut->copy()->addDays($data['duree_incubation']);

            // Générer un code lot unique si non fourni
            if (empty($data['code_lot'])) {
                $data['code_lot'] = 'LOT-' . strtoupper($couveuse->nom) . '-' . $dateDebut->format('Ymd') . '-' . str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);
            }

            // Créer le lot
            $lot = LotsCouveuse::create([
                'couveuse_id' => $data['couveuse_id'],
                'code_lot' => $data['code_lot'],
                'nb_oeufs' => $data['nb_oeufs'],
                'date_debut' => $dateDebut,
                'date_eclosion_prevue' => $dateEclosionPrevue,
                'statut' => 'en_cours'
            ]);

            // Charger les relations pour la réponse
            $lot->load('couveuse');

            return response()->json([
                'status' => 'success',
                'message' => 'Lot créé avec succès',
                'data' => [
                    'id' => $lot->id,
                    'code_lot' => $lot->code_lot,
                    'couveuse' => $lot->couveuse->nom,
                    'nb_oeufs' => $lot->nb_oeufs,
                    'date_debut' => $lot->date_debut->format('Y-m-d'),
                    'date_eclosion_prevue' => $lot->date_eclosion_prevue->format('Y-m-d'),
                    'statut' => $lot->statut,
                    'jours_restants' => $lot->jours_restants,
                    'progression' => $lot->progression
                ]
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la création du lot',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(LotsCouveuse $lotsCouveuse)
    {
        return $lotsCouveuse->load('couveuse');
    }

    public function update(Request $request, LotsCouveuse $lotsCouveuse)
    {
        $lotsCouveuse->update($request->all());
        return $lotsCouveuse;
    }

    public function destroy(LotsCouveuse $lotsCouveuse)
    {
        $lotsCouveuse->delete();
        return response()->json(['message' => 'Lot supprimé avec succès']);
    }
}
