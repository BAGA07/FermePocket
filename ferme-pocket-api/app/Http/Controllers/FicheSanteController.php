<?php

namespace App\Http\Controllers;

use App\Models\FicheSante;
use Illuminate\Http\Request;

class FicheSanteController extends Controller
{
    public function index()
    {
        return FicheSante::with('veterinaire')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'veterinaire_id' => 'nullable|exists:users,id',
            'description' => 'required|string',
            'traitement' => 'nullable|string',
            'date' => 'required|date'
        ]);

        return FicheSante::create($data);
    }

    public function show(FicheSante $fiches_sante)
    {
        return $fiches_sante->load('veterinaire');
    }

    public function update(Request $request, FicheSante $fiches_sante)
    {
        $fiches_sante->update($request->all());
        return $fiches_sante;
    }

    public function destroy(FicheSante $fiches_sante)
    {
        $fiches_sante->delete();
        return response()->json(['message' => 'Fiche supprimée avec succès']);
    }
}