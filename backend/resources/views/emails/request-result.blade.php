<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body>
<h2>Заполнена форма {{ $form }} на {{ $site}}</h2>

<div>
    <p>Дата {{ $result->created_at }}, №{{ $result->id }}</p>
    @foreach(['name' => 'Имя', 'phone' => 'Телефон', 'email' => 'Email'] as $field => $label)
        <p>{{ $label }}: {{ $result->$field }}</p>
    @endforeach
    @foreach(['message' => 'Сообщение'] as $field => $label)
        @if(isset($result->content[$field]))
            <p>{{ $label }}: {{ $result->content[$field] }}</p>
        @endif
    @endforeach
</div>

</body>
</html>