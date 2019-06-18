<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::post('/contact', 'FeedbackController@index');

Route::get('/{name}.pdf', function ($name) {
    $map = [
        'pres' => 'presentation', 'pres-min' => 'presentation_min',
        'presentation' => 'presentation', 'presentation-min' => 'presentation_min'
    ];
    if (!isset($map[$name])) {
        abort(404);
    }

    $el = \App\Models\Setting::query()
        ->where('section', 'presentation')->where('key', $map[$name])
        ->with('files')->first();
    if (!$el) abort(404);


    return response()->file(public_path($el->file($map[$name])));
});
