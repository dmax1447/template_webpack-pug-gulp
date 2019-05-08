@extends('twill::layouts.form')

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
    @formField('input', [
    'name' => 'tech',
    'label' => 'Технологии',
    'translated' => true,
    'maxlength' => 200
    ])
    @formField('input', [
    'name' => 'lead',
    'label' => 'Анонс',
    'translated' => true,
    'maxlength' => 200
    ])

    @formField('wysiwyg', [
    'name' => 'description',
    'label' => 'Контент',
    'translated' => true,
    'editSource' => true,
    ])

@stop
