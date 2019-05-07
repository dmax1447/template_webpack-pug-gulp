@extends('twill::layouts.form')

@section('contentFields')
    @formField('wysiwyg', [
        'name' => 'content',
        'label' => 'Контент',
        'translated' => true,
        'editSource' => true,
    ])

    @formField('block_editor', ['blocks' => ['features_offered', 'image']])
@stop
