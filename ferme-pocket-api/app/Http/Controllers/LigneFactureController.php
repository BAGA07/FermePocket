<?php

namespace App\Http\Controllers;

use App\Models\LigneFacture;
use Illuminate\Http\Request;

class LigneFactureController extends Controller
{
    public function index()
    {
        return LigneFacture::with('facture')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'facture_id' => 'required|exists:factures,id',
            'produit' => 'required|string|max:255',
            'quantite' => 'required|numeric',
            'prix_unitaire' => 'required|numeric',
            'prix_total' => 'required|numeric'
        ]);

        return LigneFacture::create($data);
    }

    public function show(LigneFacture $lignes_facture)
    {
        return $lignes_facture->load('facture');
    }

    public function update(Request $request, LigneFacture $lignes_facture)
    {
        $lignes_facture->update($request->all());
        return $lignes_facture;
    }

    public function destroy(LigneFacture $lignes_facture)
    {
        $lignes_facture->delete();
        return response()->json(['message' => 'Ligne supprimée avec succès']);
    }
}