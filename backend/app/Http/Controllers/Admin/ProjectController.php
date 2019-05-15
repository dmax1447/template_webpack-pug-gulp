<?php

namespace App\Http\Controllers\Admin;

use A17\Twill\Http\Controllers\Admin\ModuleController;

class ProjectController extends ModuleController
{
    protected $moduleName = 'projects';
    protected $titleColumnKey = 'title';

    protected $indexOptions = [
        'reorder' => true,
    ];

    protected $indexColumns = [
        'project_cover' => [
            'field' => 'project_cover',
            'title' => 'Превью',
            'thumb' => true, // image column
            'variant' => [
                'role' => 'project_cover',
                'crop' => 'desktop',
            ],
        ],
        'title' => [
            'title' => 'Кейс',
            'field' => 'title',
            'sort' => true,
        ],
    ];
}
