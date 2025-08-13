<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStocksAlimentsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stock_aliments', function (Blueprint $table) {
            $table->id(); // équivalent unsignedBigInteger autoIncrement
            $table->string('nom');
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('unite'); // kg, sac, litre
            $table->float('quantite');
            $table->float('seuil_alerte')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stocks_aliments');
    }
}
