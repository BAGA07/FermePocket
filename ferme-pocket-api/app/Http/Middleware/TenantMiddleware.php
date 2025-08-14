<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Tenant;

class TenantMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // 1️⃣ Récupérer le tenant depuis le sous-domaine ou le token

        $host = $request->getHost(); // ex: client1.ferme-pocket.com
        $subdomain = explode('.', $host)[0]; // "client1"

        // Si on est en local (localhost ou 127.0.0.1), utiliser le tenant par défaut (id=1)
        if ($host === 'localhost' || $host === '127.0.0.1') {
            $tenant = Tenant::find(1);
        } else {
            $tenant = Tenant::where('subdomain', $subdomain)->first();
        }

        if (!$tenant) {
            abort(404, 'Tenant introuvable.');
        }

        // 3️⃣ Stocker dans le service container pour y accéder partout
        app()->instance('tenant', $tenant);

        // 4️⃣ Forcer toutes les requêtes Eloquent à être filtrées par tenant_id
        \Illuminate\Database\Eloquent\Builder::macro('forTenant', function () use ($tenant) {
            return $this->where('tenant_id', $tenant->id);
        });

        return $next($request);
    }
}
