@formField('input', [
'name' => 'client_name',
'label' => 'Клиент (ФИО)',
'translated' => true,
'maxlength' => 200
])

@formField('input', [
'name' => 'client_position',
'label' => 'Клиент (должность)',
'translated' => true,
'maxlength' => 200
])

@formField('medias', [
'name' => 'client_photo',
'label' => 'Фото',
])

@formField('wysiwyg', [
'name' => 'client_review',
'label' => 'Отзыв',
'translated' => true,
'editSource' => true
])