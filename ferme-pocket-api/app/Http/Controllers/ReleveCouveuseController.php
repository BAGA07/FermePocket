<?php

namespace App\Http\Controllers;

use App\Models\ReleveCouveuse;
use Illuminate\Http\Request;

class ReleveCouveuseController extends Controller
{
    public function index()
    {
        return ReleveCouveuse::with('couveuse')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'couveuse_id' => 'required|exists:couveuses,id',
            'temperature' => 'required|numeric',
            'humidite' => 'required|numeric',
            'date_releve' => 'required|date'
        ]);

        return ReleveCouveuse::create($data);
    }

    public function show(ReleveCouveuse $releveCouveuse)
    {
        return $releveCouveuse->load('couveuse');
    }

    public function update(Request $request, ReleveCouveuse $releveCouveuse)
    {
        $releveCouveuse->update($request->all());
        return $releveCouveuse;
    }

    public function destroy(ReleveCouveuse $releveCouveuse)
    {
        $releveCouveuse->delete();
        return response()->json(['message' => 'Relevé supprimé avec succès']);
    }
}