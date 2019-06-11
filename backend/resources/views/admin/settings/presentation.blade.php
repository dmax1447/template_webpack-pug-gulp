@extends('twill::layouts.settings', ['contentFieldsetLabel' => 'Загрузка презентаций'])

@section('contentFields')
    @formField('files', [
    'name' => 'medias[presentation]',
    'label' => 'Презентация в PDF',
    'note' => 'Экспорт многостраничных PDF-документов https://tlgrm.ru/channels/@figmatips/216',
    ])

    @formField('files', [
    'name' => 'medias[presentation_min]',
    'label' => 'Презентация в PDF минимизированная',
    'note' => 'PDF компрессор https://pdfcompressor.com/',
    ])
@stop