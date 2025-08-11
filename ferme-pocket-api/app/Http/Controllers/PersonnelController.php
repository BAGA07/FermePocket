<?php

namespace App\Http\Controllers;

use App\Models\Personnel;
use Illuminate\Http\Request;

class PersonnelController extends Controller
{
    public function index()
    {
        return Personnel::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string|max:255',
            'poste' => 'required|string|max:255',
            'telephone' => 'nullable|string|max:50',
            'salaire' => 'nullable|numeric',
            'date_embauche' => 'required|date'
        ]);

        return Personnel::create($data);
    }

    public function show(Personnel $personnel)
    {
        return $personnel;
    }

    public function update(Request $request, Personnel $personnel)
    {
        $personnel->update($request->all());
        return $personnel;
    }

    public function destroy(Personnel $personnel)
    {
        $personnel->delete();
        return response()->json(['message' => 'Personnel supprimé avec succès']);
    }
}