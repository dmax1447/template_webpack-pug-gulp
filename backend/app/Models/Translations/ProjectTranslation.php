<?php

namespace App\Models\Translations;

use A17\Twill\Models\Model;

class ProjectTranslation extends Model
{
    protected $fillable = [
        'title',
        'tech',
        'lead',
        'description',
        'goal',
        'result',
        'active',
        'locale',
    ];
}
