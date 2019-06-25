@extends('twill::layouts.form', ['contentFieldsetLabel' => 'Контент кейса'])

@section('contentFields')
    @formField('input', [
        'name' => 'project_slug',
        'label' => 'Slug кейса',
        'required' => true,
        'maxlength' => 100
    ])
    @formField('input', [
    'name' => 'url',
    'label' => 'URL кейса',
    ])
    @formField('medias', [
    'name' => 'project_cover',
    'label' => 'Обложка превью',
    'required' => true,
    'withAddInfo' => true,
    'withCaption' => false
    ])
    @formField('files', [
    'name' => 'video_preview',
    'label' => 'Видео превью',
    ])
    @formField('input', [
    'name' => 'tech',
    'label' => 'Технологии',
    'translated' => true,
    'required' => true,
    'maxlength' => 200
    ])
    @formField('input', [
    'name' => 'lead',
    'label' => 'Анонс',
    'translated' => true,
    'required' => true,
    'maxlength' => 200
    ])

    @formField('wysiwyg', [
    'name' => 'description',
    'label' => 'Контент',
    'translated' => true,
    'editSource' => true,
    'toolbarOptions' => [ [ 'header' => [2, 3, 4, 5, false] ], 'list-ordered', 'list-unordered', 'clean' ],
    ])
@stop

@section('fieldsets')
    <a17-fieldset title="Галерея" id="gallery">
        @formField('medias', [
        'name' => 'project_desktop',
        'label' => 'Десктоп превью',
        'required' => false,
        'withAddInfo' => false,
        'withCaption' => false
        ])
        @formField('medias', [
        'name' => 'project_mobile',
        'max' => 4,
        'label' => 'Мобильные превью',
        'required' => false,
        'withAddInfo' => false,
        'withCaption' => false
        ])
        @formField('medias', [
        'name' => 'project_tablet',
        'max' => 2,
        'label' => 'Планшет превью',
        'required' => false,
        'withAddInfo' => false,
        'withCaption' => false
        ])
        @formField('medias', [
        'name' => 'project_clean',
        'max' => 4,
        'label' => 'Превью без обвеса',
        'required' => false,
        'withAddInfo' => false,
        'withCaption' => false
        ])
        @formField('medias', [
        'name' => 'project_result',
        'max' => 4,
        'label' => 'Результаты',
        'required' => false,
        'withAddInfo' => false,
        'withCaption' => false
        ])
        @formField('select', [
        'name' => 'resultStroke',
        'label' => 'Тип обводки результата',
        'options' => [
            ['value' => 'android', 'label' => 'android'],
            ['value' => 'ios', 'label' => 'ios'],
            ['value' => 'browser', 'label' => 'browser'],
        ]])
    </a17-fieldset>

    <a17-fieldset title="Дополнительные атрибуты" id="attributes">
        @formField('color', [
        'name' => 'backgroundColor',
        'label' => 'Цвет темного фона',
        ])
        @formField('color', [
        'name' => 'fontColor',
        'label' => 'Цвет текста темного фона',
        ])

        @formField('wysiwyg', [
        'name' => 'goal',
        'label' => 'Цель',
        'translated' => true,
        'editSource' => true,
        'toolbarOptions' => [ [ 'header' => [2, 3, 4, 5, false] ], 'list-ordered', 'list-unordered', 'clean' ],
        ])

        @formField('wysiwyg', [
        'name' => 'result',
        'label' => 'Результат',
        'translated' => true,
        'editSource' => true,
        'toolbarOptions' => [ [ 'header' => [2, 3, 4, 5, false] ], 'list-ordered', 'list-unordered', 'clean' ],
        ])
        @formField('block_editor', ['blocks' => ['project_step', 'client_review']])
    </a17-fieldset>
@stop
