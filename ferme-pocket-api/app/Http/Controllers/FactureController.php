<?php

namespace App\Http\Controllers;

use App\Models\Facture;
use Illuminate\Http\Request;

class FactureController extends Controller
{
    public function index()
    {
        return Facture::with('client', 'lignes')
            ->where('tenant_id', auth()->user()->tenant_id)
            ->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:clients,id',
            'date' => 'required|date',
            'montant_total' => 'required|numeric',
            'lignes' => 'required|array',
            'lignes.*.description' => 'required|string',
            'lignes.*.quantite' => 'required|numeric',
            'lignes.*.prix_unitaire' => 'required|numeric',
            'statut' => 'nullable|in:payee,impayee,partiel',
        ]);

        $facture = Facture::create([
            'tenant_id' => auth()->user()->tenant_id,
            'user_id' => auth()->id(),
            'client_id' => $request->client_id,
            'date' => $request->date,
            'montant_total' => $request->montant_total,
            'statut' => $request->statut ?? 'impayee',
        ]);

        // Créer les lignes
        foreach ($request->lignes as $ligne) {
            $facture->lignes()->create($ligne);
        }

        return response()->json($facture->load('lignes', 'client', 'utilisateur'), 201);
    }

    public function show(Facture $facture)
    {
        return $facture->load('client', 'lignes');
    }

    public function update(Request $request, Facture $facture)
    {
        $facture->update($request->all());
        return $facture;
    }

    public function destroy(Facture $facture)
    {
        $facture->delete();
        return response()->json(['message' => 'Facture supprimée avec succès']);
    }
}
