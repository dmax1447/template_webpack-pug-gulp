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
}
