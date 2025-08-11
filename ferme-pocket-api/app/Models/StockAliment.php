<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockAliment extends Model
{
    public function mouvements()
    {
        return $this->hasMany(MouvementStock::class, 'stock_id');
    }
}