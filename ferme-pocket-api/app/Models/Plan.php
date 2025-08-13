<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    protected $fillable = ['code', 'name', 'price_cents', 'currency', 'is_active'];
    public function features(): HasMany
    {
        return $this->hasMany(PlanFeature::class);
    }
}
