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
        Schema::create('lot_oeufs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('couveuse_id')->constrained('couveuses')->cascadeOnDelete();
            $table->string('reference')->nullable();
            $table->integer('quantite');
            $table->date('date_mise_couveuse');
            $table->integer('jours_incubation_prevu')->nullable();
            $table->integer('taux_eclosion_prevu')->nullable();
            $table->string('etat')->default('en_cours'); // en_cours, terminé
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lot_oeufs');
    }
};
