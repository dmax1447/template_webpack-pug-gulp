<?php

namespace App\Models;


use A17\Twill\Models\Model;

class Feedback extends Model 
{
    protected $fillable = [
        'title',
        'name',
        'email',
        'phone'
    ];
    protected $casts = [
        'content' => 'array'
    ];
}
