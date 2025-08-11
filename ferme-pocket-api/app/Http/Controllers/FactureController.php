<?php

namespace App\Http\Controllers;

use App\Models\Facture;
use Illuminate\Http\Request;

class FactureController extends Controller
{
    public function index()
    {
        return Facture::with('client', 'lignes')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'date_facture' => 'required|date',
            'total' => 'required|numeric'
        ]);

        return Facture::create($data);
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