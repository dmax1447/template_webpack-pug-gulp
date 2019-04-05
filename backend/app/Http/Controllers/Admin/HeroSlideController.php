<?php

namespace App\Http\Controllers\Admin;

use A17\Twill\Http\Controllers\Admin\ModuleController;

class HeroSlideController extends ModuleController
{
    protected $moduleName = 'HeroSlides';
    protected $titleColumnKey = 'header';
    protected $indexColumns = [
        'header' => [
            'title' => 'Слайд',
            'field' => 'header',
        ],
    ];

    protected $indexOptions = [
        'reorder' => true,
    ];
}
