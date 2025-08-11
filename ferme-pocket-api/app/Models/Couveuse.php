<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Couveuse extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'capacite',
        'type',
        'statut'
    ];

    protected $casts = [
        'capacite' => 'integer',
    ];

    public function lots()
    {
        return $this->hasMany(LotsCouveuse::class);
    }

    public function releves()
    {
        return $this->hasMany(ReleveCouveuse::class);
    }

    // Méthodes utiles pour le dashboard
    public function getLotsActifsAttribute()
    {
        return $this->lots()->where('statut', 'en_cours')->count();
    }

    public function getOccupationActuelleAttribute()
    {
        return $this->lots()
            ->where('statut', 'en_cours')
            ->sum('nb_oeufs');
    }

    public function getDernierReleveAttribute()
    {
        return $this->releves()
            ->latest('date_releve')
            ->first();
    }

    public function getTemperatureActuelleAttribute()
    {
        $dernierReleve = $this->dernierReleve;
        return $dernierReleve ? $dernierReleve->temperature : null;
    }

    public function getHumiditeActuelleAttribute()
    {
        $dernierReleve = $this->dernierReleve;
        return $dernierReleve ? $dernierReleve->humidite : null;
    }

    public function getTauxOccupationAttribute()
    {
        return $this->capacite > 0 ? round(($this->occupationActuelle / $this->capacite) * 100, 1) : 0;
    }
}