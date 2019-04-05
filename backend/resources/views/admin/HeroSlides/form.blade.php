@extends('twill::layouts.form')

@section('contentFields')
    @formField('input', [
        'name' => 'css_id',
        'label' => 'ID слайда',
        'maxlength' => 100,
        'note' => 'CSS ID слайда'
    ])

    @formField('input', [
        'name' => 'text',
        'label' => 'Текст',
        'translated' => true,
        'maxlength' => 200,
        'note' => 'Анонс слайда'
    ])

    @formField('input', [
        'name' => 'cta_text',
        'label' => 'Текст CTA',
        'translated' => true,
        'maxlength' => 200,
        'note' => 'Текст ссылки слайда'
    ])

    @formField('input', [
        'name' => 'cta_link',
        'label' => 'Ссылка CTA',
        'translated' => true,
        'maxlength' => 200,
        'note' => 'Ссылка слайда'
    ])

    @formField('block_editor')
@stop
