@extends('twill::layouts.form')

@section('contentFields')
    @formField('input', [
        'name' => 'text',
        'label' => 'Текст',
        'translated' => true,
        'maxlength' => 200
    ])

    @formField('input', [
    'name' => 'cta_text',
    'label' => 'Текст CTA',
    'translated' => true,
    'maxlength' => 200
    ])

    @formField('input', [
    'name' => 'cta_link',
    'label' => 'Ссылка CTA',
    'translated' => true,
    'maxlength' => 200
    ])

    @formField('block_editor')
@stop
