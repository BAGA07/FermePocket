<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FicheSante extends Model
{
    public function veterinaire()
    {
        return $this->belongsTo(User::class, 'veterinaire_id');
    }
}