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
    'withCaption' => false
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
    <a17-fieldset title="Дополнительные атрибуты" id="attributes">
    </a17-fieldset>
@stop
