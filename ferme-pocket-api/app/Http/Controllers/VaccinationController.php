<?php

namespace App\Http\Controllers;

use App\Models\Vaccination;
use Illuminate\Http\Request;

class VaccinationController extends Controller
{
    public function index()
    {
        return Vaccination::with('lotVolaille')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'lot_volaille_id' => 'required|exists:lot_volailles,id',
            'vaccin' => 'required|string|max:255',
            'date_vaccination' => 'required|date',
            'dose' => 'nullable|string|max:100',
            'observations' => 'nullable|string'
        ]);

        return Vaccination::create($data);
    }

    public function show(Vaccination $vaccination)
    {
        return $vaccination->load('lotVolaille');
    }

    public function update(Request $request, Vaccination $vaccination)
    {
        $vaccination->update($request->all());
        return $vaccination;
    }

    public function destroy(Vaccination $vaccination)
    {
        $vaccination->delete();
        return response()->json(['message' => 'Vaccination supprimée avec succès']);
    }
}