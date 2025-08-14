<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Vaccination extends Model
{
    protected $fillable = [
        // Ajoutez ici les champs autorisés pour l'assignation de masse
        'date',
        'nom_vaccin',
        'remarques',
        'tenant_id',
        'lot_id', // Correspond à la clé étrangère de la migration
    ];

    public function lotVolaille()
    {
        return $this->belongsTo(LotVolaille::class);
    }
}
