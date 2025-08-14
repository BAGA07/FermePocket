<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LotVolaille extends Model
{
    protected $table = 'lot_volailles';

    public function vaccinations()
    {
        return $this->hasMany(Vaccination::class, 'lot_id');
    }
}
