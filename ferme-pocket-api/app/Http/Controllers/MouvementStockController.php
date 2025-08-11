<?php

namespace App\Http\Controllers;

use App\Models\MouvementStock;
use Illuminate\Http\Request;

class MouvementStockController extends Controller
{
    public function index()
    {
        return MouvementStock::with('stock')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'stock_id' => 'required|exists:stocks_aliments,id',
            'type' => 'required|in:entree,sortie',
            'quantite' => 'required|numeric',
            'motif' => 'nullable|string'
        ]);

        return MouvementStock::create($data);
    }

    public function show(MouvementStock $mouvements_stock)
    {
        return $mouvements_stock->load('stock');
    }

    public function update(Request $request, MouvementStock $mouvements_stock)
    {
        $mouvements_stock->update($request->all());
        return $mouvements_stock;
    }

    public function destroy(MouvementStock $mouvements_stock)
    {
        $mouvements_stock->delete();
        return response()->json(['message' => 'Mouvement supprimé avec succès']);
    }
}