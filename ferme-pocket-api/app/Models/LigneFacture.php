<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LigneFacture extends Model
{
    public function facture()
    {
        return $this->belongsTo(Facture::class);
    }
}