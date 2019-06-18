<?php

namespace App\Http\Controllers\Admin;

use A17\Twill\Http\Controllers\Admin\ModuleController;

class FeedbackController extends ModuleController
{
    protected $moduleName = 'feedback';
    protected $titleColumnKey = 'name';
    protected $indexOptions = [
        'publish' => false,
        'editInModal' => true,
        'permalink' => false,
    ];

    protected $indexColumns = [
        'name' => [
            'title' => 'Имя',
            'field' => 'name',
            'sort' => true,
        ],
        'email' => [
            'title' => 'E-mail',
            'field' => 'email',
            'sort' => true,
        ],
    ];
}
