<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subscription extends Model
{
    protected $fillable = [
        'tenant_id',
        'plan_id',
        'provider',
        'provider_customer_id',
        'provider_subscription_id',
        'status',
        'current_period_end'
    ];
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }
}
