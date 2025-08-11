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
        Schema::create('releve_couveuses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('couveuse_id')->constrained('couveuses')->onDelete('cascade');
            $table->float('temperature');
            $table->float('humidite');
            $table->timestamp('date_releve');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('releve_couveuses');
    }
};