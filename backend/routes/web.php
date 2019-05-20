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

Route::get('/build', function () {
    Artisan::call('bereza:build', ['--commit-content' => true]);
    return view('welcome');
});

Route::get('/contact', function () {
    return view('contact');
});

Route::post('/contact', 'FeedbackController@index');
