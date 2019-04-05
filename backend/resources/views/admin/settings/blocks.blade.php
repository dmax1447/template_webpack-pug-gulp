@extends('twill::layouts.settings')

@section('contentFields')
    @formField('input', [
        'label' => 'Copyright',
        'name' => 'copyright',
        'textLimit' => '200',
        'translated' => true
    ])
    @formField('input', [
        'label' => 'Помогаем',
        'name' => 'label_main_help',
        'textLimit' => '200',
        'translated' => true
    ])
    @formField('input', [
        'label' => 'Предлагаем',
        'name' => 'label_main_offer',
        'textLimit' => '200',
        'translated' => true
    ])
    @formField('input', [
        'label' => 'Общаемся',
        'name' => 'label_main_contact',
        'textLimit' => '200',
        'translated' => true
    ])
    @formField('input', [
    'label' => 'Свяжитесь с нами',
    'name' => 'contact_header',
    'textLimit' => '100',
    'translated' => true
    ])
    @formField('input', [
    'label' => 'Ваше имя',
    'name' => 'contact_name_label',
    'textLimit' => '100',
    'translated' => true
    ])
    @formField('input', [
    'label' => 'Ваше имя',
    'name' => 'contact_name_placeholder',
    'textLimit' => '100',
    'translated' => true,
    'note' => 'Placeholder',
    ])
    @formField('input', [
    'label' => 'Ваш e-mail',
    'name' => 'contact_email_label',
    'textLimit' => '100',
    'translated' => true
    ])
    @formField('input', [
    'label' => 'Ваш телефон',
    'name' => 'contact_phone_label',
    'textLimit' => '100',
    'translated' => true
    ])
    @formField('input', [
    'label' => 'Сообщение',
    'name' => 'contact_msg_label',
    'textLimit' => '100',
    'translated' => true
    ])
    @formField('input', [
    'label' => 'Сообщение',
    'name' => 'contact_msg_placeholder',
    'textLimit' => '100',
    'translated' => true,
    'note' => 'Placeholder',
    ])
@stop