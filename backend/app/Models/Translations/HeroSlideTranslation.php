<?php

namespace App\Models\Translations;

use A17\Twill\Models\Model;

class HeroSlideTranslation extends Model
{
    protected $fillable = [
        'header',
        'text',
        'cta_text',
        'cta_link',
        'active',
        'locale',
    ];
}
