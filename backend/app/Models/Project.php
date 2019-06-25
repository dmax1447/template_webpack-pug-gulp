<?php

namespace App\Models;

use A17\Twill\Models\Behaviors\HasBlocks;
use A17\Twill\Models\Behaviors\HasFiles;
use A17\Twill\Models\Behaviors\HasTranslation;
use A17\Twill\Models\Behaviors\HasMedias;
use A17\Twill\Models\Behaviors\HasPosition;
use A17\Twill\Models\Behaviors\Sortable;
use A17\Twill\Models\Model;

class Project extends Model implements Sortable
{
    use HasBlocks, HasTranslation, HasMedias, HasPosition, HasFiles;
    protected $casts = [
        'makeup' => 'array'
    ];

    protected $fillable = [
        'published',
        'project_slug',
        'url',
        'title',
        'tech',
        'lead',
        'description',
        'goal',
        'result',
        'makeup',
        'backgroundColor',
        'fontColor',
        'position',
        'resultStroke'
    ];

     public $translatedAttributes = [
         'title',
         'tech',
         'lead',
         'description',
         'goal',
         'result',
         'active',
     ];
    
    // add checkbox fields names here (published toggle is itself a checkbox)
    public $checkboxes = [
        'published'
    ];

    public $filesParams = ['video_preview'];

    // uncomment and modify this as needed if you use the HasMedias trait
     public $mediasParams = [
         'project_cover' => [
             'desktop' => [
                 [
                     'name' => 'desktop',
                     'ratio' => 16/9,
                 ],
             ]
         ],
         'project_desktop' => [
             'default' => [
                 [
                     'name' => 'default',
                     'ratio' => 16/9,
                 ],
             ]
         ],
         'project_mobile' => [
             'default' => [
                 [
                     'name' => 'default',
                     'ratio' => 1,
                 ],
             ]
         ],
         'project_tablet' => [
             'default' => [
                 [
                     'name' => 'default',
                     'ratio' => 1,
                 ],
             ]
         ],
         'project_clean' => [
             'default' => [
                 [
                     'name' => 'default',
                     'ratio' => 1,
                 ],
             ]
         ],
         'project_result' => [
             'default' => [
                 [
                     'name' => 'default',
                     'ratio' => 1,
                 ],
             ]
         ],
     ];

    public function getBackgroundColorAttribute() {
         return $this->makeup['backgroundColor'] ?? '';
     }

    public function setBackgroundColorAttribute($val) {
        $v = $this->makeup;
        $v['backgroundColor'] = $val;
        $this->makeup = $v;
    }

    public function getFontColorAttribute() {
        return $this->makeup['fontColor'] ?? '';
    }

    public function setFontColorAttribute($val) {
        $v = $this->makeup;
        $v['fontColor'] = $val;
        $this->makeup = $v;
    }

    public function getResultStrokeAttribute() {
        return $this->makeup['resultStroke'] ?? 'browser';
    }

    public function setResultStrokeAttribute($val) {
        $v = $this->makeup;
        $v['resultStroke'] = $val;
        $this->makeup = $v;
    }
}
