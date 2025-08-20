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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id'); // multi-tenant
            $table->unsignedBigInteger('user_id'); // utilisateur qui crée
            $table->enum('type', ['revenu', 'depense']); // revenu ou dépense
            $table->string('categorie')->nullable(); // ex : "Vente poulet", "Achat aliment"
            $table->text('description')->nullable();
            $table->decimal('montant', 12, 2);
            $table->date('date_transaction')->default(now());
            $table->timestamps();

            // Relations
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
