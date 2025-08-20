<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index()
    {
        return Transaction::where('tenant_id', auth()->user()->tenant_id)
            ->orderBy('date_transaction', 'desc')
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|in:revenu,depense',
            'categorie' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'montant' => 'required|numeric',
            'date_transaction' => 'required|date',
        ]);

        $transaction = Transaction::create([
            'tenant_id' => auth()->user()->tenant_id,
            'user_id' => auth()->id(),
            ...$data
        ]);

        return response()->json($transaction, 201);
    }

    public function show(Transaction $transaction)
    {
        return $transaction;
    }

    public function update(Request $request, Transaction $transaction)
    {
        $transaction->update($request->all());
        return $transaction;
    }

    public function destroy(Transaction $transaction)
    {
        $transaction->delete();
        return response()->json(['message' => 'Transaction supprimée avec succès']);
    }
}
