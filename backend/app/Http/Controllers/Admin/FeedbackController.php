<?php

namespace App\Http\Controllers\Admin;

use A17\Twill\Http\Controllers\Admin\ModuleController;

class FeedbackController extends ModuleController
{
    protected $moduleName = 'feedback';
    protected $indexOptions = [
        'publish' => false,
    ];
}
