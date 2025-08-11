<?php

namespace App\Http\Controllers;

use App\Models\Alerte;
use Illuminate\Http\Request;

class AlerteController extends Controller
{
    public function index()
    {
        return Alerte::latest()->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|string|max:100', // stock, santé, couveuse
            'message' => 'required|string',
            'niveau' => 'required|in:info,warning,danger',
            'statut' => 'nullable|in:non_lu,lu'
        ]);

        return Alerte::create($data);
    }

    public function show(Alerte $alerte)
    {
        return $alerte;
    }

    public function update(Request $request, Alerte $alerte)
    {
        $alerte->update($request->all());
        return $alerte;
    }

    public function destroy(Alerte $alerte)
    {
        $alerte->delete();
        return response()->json(['message' => 'Alerte supprimée avec succès']);
    }
}