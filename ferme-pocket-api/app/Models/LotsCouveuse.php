<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class LotsCouveuse extends Model
{
    protected $table = 'lots_couveuses';

    protected $fillable = [
        'couveuse_id',
        'code_lot',
        'nb_oeufs',
        'date_debut',
        'date_eclosion_prevue',
        'date_eclosion_reelle',
        'nb_eclos',
        'statut'
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_eclosion_prevue' => 'date',
        'date_eclosion_reelle' => 'date',
        'nb_oeufs' => 'integer',
        'nb_eclos' => 'integer'
    ];

    // Relations
    public function couveuse()
    {
        return $this->belongsTo(Couveuse::class);
    }

    // Méthodes calculées
    public function getTauxReussiteAttribute()
    {
        if (!$this->nb_eclos || !$this->nb_oeufs) {
            return 0;
        }
        return round(($this->nb_eclos / $this->nb_oeufs) * 100, 2);
    }

    public function getJoursRestantsAttribute()
    {
        if ($this->statut !== 'en_cours') {
            return 0;
        }

        $now = Carbon::now();
        $dateEclosion = Carbon::parse($this->date_eclosion_prevue);

        return max(0, $now->diffInDays($dateEclosion, false));
    }

    public function getProgressionAttribute()
    {
        $dateDebut = Carbon::parse($this->date_debut);
        $dateEclosion = Carbon::parse($this->date_eclosion_prevue);
        $now = Carbon::now();

        $dureeTotal = $dateDebut->diffInDays($dateEclosion);
        $joursEcoules = $dateDebut->diffInDays($now);

        return min(100, max(0, round(($joursEcoules / $dureeTotal) * 100, 2)));
    }
}
