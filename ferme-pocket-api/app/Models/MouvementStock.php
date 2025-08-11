<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MouvementStock extends Model
{
    public function stock()
    {
        return $this->belongsTo(StockAliment::class, 'stock_id');
    }
}