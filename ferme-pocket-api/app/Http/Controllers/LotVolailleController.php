<?php

namespace App\Http\Controllers;

use App\Models\LotVolaille;
use Illuminate\Http\Request;

class LotVolailleController extends Controller
{
    public function index()
    {
        return LotVolaille::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom_lot' => 'required|string|max:255',
            'type_volaille' => 'required|string|max:100', // chair, pondeuse
            'quantite' => 'required|integer',
            'date_arrivee' => 'required|date',
            'origine' => 'nullable|string|max:255'
        ]);

        return LotVolaille::create($data);
    }

    public function show(LotVolaille $lot_volaille)
    {
        return $lot_volaille;
    }

    public function update(Request $request, LotVolaille $lot_volaille)
    {
        $lot_volaille->update($request->all());
        return $lot_volaille;
    }

    public function destroy(LotVolaille $lot_volaille)
    {
        $lot_volaille->delete();
        return response()->json(['message' => 'Lot de volailles supprimé avec succès']);
    }
}