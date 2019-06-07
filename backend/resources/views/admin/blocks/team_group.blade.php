@formField('input', [
'name' => 'key',
'label' => 'Key',
'maxlength' => 100
])

@formField('input', [
'name' => 'category',
'label' => 'Категория',
'translated' => true,
'maxlength' => 200
])

@formField('input', [
'name' => 'name',
'label' => 'Имя',
'translated' => true,
'maxlength' => 200
])

@formField('input', [
'name' => 'job',
'label' => 'Должность',
'translated' => true,
'maxlength' => 200
])

@formField('input', [
'name' => 'spec',
'label' => 'Специализация',
'translated' => true,
'maxlength' => 200
])

@formField('wysiwyg', [
'name' => 'text',
'label' => 'Описание',
'translated' => true,
'editSource' => true,
'toolbarOptions' => [ [ 'header' => [2, 3, 4, 5, false] ], 'clean' ],
])

@formField('input', [
'name' => 'alsoHeader',
'label' => 'Также текст',
'translated' => true,
'maxlength' => 200
])

@formField('medias', [
'name' => 'icon',
'label' => 'Фото',
])

@formField('repeater', ['type' => 'team_group_member'])