<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Http\Request;

use A17\Twill\Http\Controllers\Admin\ModuleController;

class RebuildController extends ModuleController
{
    protected $moduleName = 'rebuild';

    public function __construct(Application $app, Request $request) {
    }

        public function index($parentModuleId = null) {

        Artisan::call('bereza:build', ['--commit-content' => true, '--build' => true]);

        return view('admin.rebuild.index', []);
    }
}
