<?php

namespace App\Http\Controllers;

use App\Models\Presence;
use Illuminate\Http\Request;

class PresenceController extends Controller
{
    public function index()
    {
        return Presence::with('user')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'status' => 'required|in:present,absent,conge'
        ]);

        return Presence::create($data);
    }

    public function show(Presence $presence)
    {
        return $presence->load('user');
    }

    public function update(Request $request, Presence $presence)
    {
        $presence->update($request->all());
        return $presence;
    }

    public function destroy(Presence $presence)
    {
        $presence->delete();
        return response()->json(['message' => 'Présence supprimée avec succès']);
    }
}