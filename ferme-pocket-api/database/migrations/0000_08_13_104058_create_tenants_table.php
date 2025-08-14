<?php
// database/migrations/2025_01_01_000000_create_tenants_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique(); // ex: acme
            $table->string('subdomain')->nullable()->unique(); // ex: acme.ferme-pocket.com (optionnel)
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};
