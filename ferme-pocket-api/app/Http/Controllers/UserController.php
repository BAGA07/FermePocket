<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Liste des utilisateurs (avec recherche et filtrage)
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Recherche par nom ou email
        if ($request->has('search') && $request->search != '') {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        // Filtrage par rôle
        if ($request->has('role') && $request->role != '') {
            $query->where('role', $request->role);
        }

        return $query->orderBy('created_at', 'desc')->paginate(10);
    }

    /**
     * Création d'un utilisateur
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'nullable|string|max:50'
        ]);

        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Utilisateur créé avec succès.',
            'data' => $user
        ], 201);
    }

    /**
     * Afficher un utilisateur
     */
    public function show(User $user)
    {
        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }

    /**
     * Mise à jour d'un utilisateur
     */
    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:100',
            'email' => 'sometimes|string|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6',
            'role' => 'nullable|string|max:50'
        ]);

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Utilisateur mis à jour avec succès.',
            'data' => $user
        ]);
    }

    /**
     * Suppression d'un utilisateur
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Utilisateur supprimé avec succès.'
        ]);
    }
}