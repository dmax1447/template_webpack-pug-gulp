@extends('twill::layouts.form')

@section('contentFields')
    @formField('input', [
        'name' => 'css_id',
        'label' => 'ID слайда',
        'maxlength' => 100,
        'note' => 'CSS ID слайда'
    ])

    @formField('input', [
        'name' => 'header',
        'label' => 'Заголовок',
        'maxlength' => 100,
        'translated' => true,
        'note' => 'Заголовок слайда'
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

    @formField('input', [
    'name' => 'video',
    'label' => 'Путь к Видео',
    'maxlength' => 250,
    ])

    @formField('input', [
    'name' => 'backgroundStyle',
    'label' => 'backgroundStyle',
    'maxlength' => 250,
    ])

    @formField('block_editor', ['blocks' => ['slide_item']])
@stop