<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lot_volailles', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['pondeuse', 'chair']);
            $table->integer('quantite');
            $table->date('date_debut');
            $table->float('poids_moyen')->nullable();
            $table->enum('statut', ['actif', 'vendu', 'perdu'])->default('actif');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lot_volailles');
    }
};