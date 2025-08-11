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
        Schema::create('fiche_santes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lot_id')->constrained('lot_volailles')->onDelete('cascade');
            $table->string('maladie');
            $table->text('symptomes')->nullable();
            $table->text('traitement')->nullable();
            $table->date('date');
            $table->foreignId('veterinaire_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fiche_santes');
    }
};