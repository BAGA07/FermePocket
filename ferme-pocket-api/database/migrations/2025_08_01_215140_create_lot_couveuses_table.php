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
        Schema::create('lots_couveuses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('couveuse_id')->constrained('couveuses')->onDelete('cascade');
            $table->string('code_lot');
            $table->integer('nb_oeufs');
            $table->date('date_debut');
            $table->date('date_eclosion_prevue');
            $table->date('date_eclosion_reelle')->nullable();
            $table->integer('nb_eclos')->nullable();
            $table->enum('statut', ['en_cours', 'termine', 'echec'])->default('en_cours');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lots_couveuses');
    }
};
