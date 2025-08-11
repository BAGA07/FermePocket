<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReleveCouveuse extends Model
{
    public function couveuse()
    {
        return $this->belongsTo(Couveuse::class);
    }
}