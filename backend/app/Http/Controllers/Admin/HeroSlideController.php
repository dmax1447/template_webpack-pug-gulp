<?php

namespace App\Http\Controllers\Admin;

use A17\Twill\Http\Controllers\Admin\ModuleController;

class HeroSlideController extends ModuleController
{
    protected $moduleName = 'HeroSlides';
    protected $titleColumnKey = 'title';
    protected $indexColumns = [
        'title' => [
            'title' => 'Слайд',
            'field' => 'title',
        ],
        'header' => [
            'title' => 'Заголовок',
            'field' => 'header',
        ],
    ];

    protected $indexOptions = [
        'reorder' => true,
    ];
}
