@extends('twill::layouts.settings')

@section('contentFields')
    @formField('input', [
        'label' => 'Сайт',
        'name' => 'meta_title',
        'textLimit' => '100',
        'translated' => true
    ])
    @formField('input', [
        'label' => 'META description',
        'name' => 'meta_description',
        'textLimit' => '200',
        'translated' => true
    ])
    @formField('input', [
        'label' => 'META keywords',
        'name' => 'meta_keywords',
        'textLimit' => '200',
        'translated' => true
    ])
@stop