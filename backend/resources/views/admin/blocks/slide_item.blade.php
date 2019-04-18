@formField('input', [
    'name' => 'title',
    'label' => 'Заголовок',
    'translated' => true,
    'maxlength' => 200
])

@formField('input', [
    'name' => 'number',
    'label' => 'Цифра',
    'maxlength' => 10
])

@formField('medias', [
    'name' => 'icons',
    'label' => 'Иконки',
    'max' => 3,
    'note' => 'SVG иконки'
])