<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LotVolaille extends Model
{
    protected $table = 'lot_volailles';
    protected $fillable = [
        'id',
        'type',
        'quantite',
        'date_debut',

    ];

    public function vaccinations()
    {
        return $this->hasMany(Vaccination::class, 'lot_id');
    }
}
