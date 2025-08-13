<?php

// database/migrations/2025_01_01_000200_create_plans_and_subscriptions.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();   // basic, pro, enterprise
            $table->string('name');
            $table->integer('price');     // en cfa
            $table->string('currency', 3)->default('XOF'); // XOF, EUR, USD
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('plan_features', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plan_id')->constrained()->cascadeOnDelete();
            $table->string('key');              // e.g. stocks.max_items
            $table->string('value');            // e.g. 100
            $table->timestamps();
            $table->unique(['plan_id', 'key']);
        });

        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('plan_id')->constrained()->cascadeOnDelete();
            $table->string('provider')->default('stripe');
            $table->string('provider_customer_id')->nullable();
            $table->string('provider_subscription_id')->nullable();
            // Statut de l'abonnement : période d'essai, actif, en retard de paiement, annulé, incomplet
            $table->enum('status', ['trialing', 'active', 'past_due', 'canceled', 'incomplete'])->default('trialing');
            $table->date('current_period_end')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
        Schema::dropIfExists('plan_features');
        Schema::dropIfExists('plans');
    }
};
