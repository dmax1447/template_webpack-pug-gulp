@formField('input', [
'name' => 'title',
'label' => 'Заголовок этапа',
'translated' => true,
'maxlength' => 200
])

@formField('wysiwyg', [
'name' => 'content',
'label' => 'Контент этапа',
'translated' => true,
'editSource' => true,
'toolbarOptions' => [ [ 'header' => [2, 3, 4, 5, false] ], 'list-ordered', 'list-unordered', 'clean' ],
])