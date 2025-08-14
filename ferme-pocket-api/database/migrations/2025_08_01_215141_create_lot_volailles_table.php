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
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('nom_lot'); // Ex: "Lot Pondeuses Janvier"
            $table->string('type_volaille'); // chair, pondeuse, etc.
            $table->string('race')->nullable(); // race de la volaille
            $table->string('origine')->nullable(); // fournisseur, ferme d'origine

            // Détails quantitatifs
            $table->unsignedInteger('quantite_initiale'); // nombre de volailles à l'arrivée
            $table->unsignedInteger('quantite_actuelle')->nullable(); // mis à jour après ventes/pertes

            // Dates importantes
            $table->date('date_arrivee'); // date d'arrivée des volailles
            $table->date('date_sortie')->nullable(); // date de fin ou vente du lot

            // Économie
            $table->decimal('prix_unitaire', 10, 2)->nullable(); // prix d'achat par volaille
            $table->decimal('prix_total', 12, 2)->nullable(); // calculé ou saisi

            // Traçabilité
            $table->string('etat')->default('actif'); // actif, vendu, terminé, etc.
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
