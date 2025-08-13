<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Tenant extends Model
{
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
    public function subscription(): HasOne
    {
        return $this->hasOne(Subscription::class);
    }
}
