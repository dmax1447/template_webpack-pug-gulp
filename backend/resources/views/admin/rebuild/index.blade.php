@extends('twill::layouts.main')

@section('content')
    <style>
        .appLoader {
            display: none;
        }
        .rebuild {
            visibility: visible;
            width: 80%;
            text-align: center;
            margin: 40px auto;
        }
        .app[v-cloak]>* {
            visibility: visible;
        }
        p {
            display: none;
        }
    </style>

    <div class="rebuild">
        <h2>Кажись выгрузилось, <a href="/" target="_blank">посмотреть</a></h2>
    </div>
@stop