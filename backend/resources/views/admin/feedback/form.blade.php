@extends('twill::layouts.form')

@section('contentFields')
    @formField('input', [
        'name' => 'name',
        'label' => 'Name',
        'maxlength' => 100
    ])
    @formField('input', [
    'name' => 'email',
    'label' => 'Email',
    'maxlength' => 100
    ])
    @formField('input', [
    'name' => 'phone',
    'label' => 'Phone',
    'maxlength' => 100
    ])
    @formField('input', [
    'name' => 'content',
    'label' => 'Content',
    ])
@stop
