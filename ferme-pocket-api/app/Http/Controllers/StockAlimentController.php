<?php

namespace App\Http\Controllers;

use App\Models\StockAliment;
use Illuminate\Http\Request;

class StockAlimentController extends Controller
{
    public function index()
    {
        return StockAliment::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string|max:255',
            'unite' => 'required|string|max:50', // kg, litre, sac
            'quantite' => 'required|numeric',
            'seuil_alerte' => 'nullable|numeric'
        ]);

        return StockAliment::create($data);
    }

    public function show(StockAliment $stocks_aliment)
    {
        return $stocks_aliment;
    }

    public function update(Request $request, StockAliment $stocks_aliment)
    {
        $stocks_aliment->update($request->all());
        return $stocks_aliment;
    }

    public function destroy(StockAliment $stocks_aliment)
    {
        $stocks_aliment->delete();
        return response()->json(['message' => 'Stock supprimé avec succès']);
    }
}