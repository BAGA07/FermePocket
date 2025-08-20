<?php

use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CouveuseController;
use App\Http\Controllers\LotCouveuseController;
use App\Http\Controllers\ReleveCouveuseController;
use App\Http\Controllers\LotVolailleController;
use App\Http\Controllers\VaccinationController;
use App\Http\Controllers\FicheSanteController;
use App\Http\Controllers\StockAlimentController;
use App\Http\Controllers\MouvementStockController;
use App\Http\Controllers\AlerteController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\FactureController;
use App\Http\Controllers\LigneFactureController;
use App\Http\Controllers\PersonnelController;
use App\Http\Controllers\PresenceController;

// ======================
// AUTHENTICATION ROUTES
// ======================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ======================
// PROTECTED ROUTES
// ======================
Route::middleware('auth:sanctum')->group(function () {

    // Users
    // Route::apiResource('users', UserController::class);

    // Couveuses
    Route::get('couveuses/dashboard', [CouveuseController::class, 'dashboard']);
    Route::apiResource('couveuses', CouveuseController::class);
    Route::apiResource('lots-couveuses', LotCouveuseController::class);
    Route::apiResource('releves-couveuses', ReleveCouveuseController::class);

    // Volailles
    Route::apiResource('lot-volailles', LotVolailleController::class);
    Route::apiResource('vaccinations', VaccinationController::class);

    // Santé vétérinaire
    Route::apiResource('fiches-sante', FicheSanteController::class);

    // Stocks
    Route::apiResource('stocks-aliments', StockAlimentController::class);
    Route::apiResource('mouvements-stock', MouvementStockController::class);

    // Alertes
    Route::apiResource('alertes', AlerteController::class);

    // Clients & Facturation
    Route::apiResource('clients', ClientController::class);
    Route::apiResource('factures', FactureController::class);
    Route::apiResource('lignes-factures', LigneFactureController::class);

    // Personnel & Présence
    Route::apiResource('personnels', PersonnelController::class);
    Route::apiResource('presences', PresenceController::class);
    // Transactions
    Route::apiResource('transactions', TransactionController::class);

    // Déconnexion
    Route::post('/logout', [AuthController::class, 'logout']);
});
