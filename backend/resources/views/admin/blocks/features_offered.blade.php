@formField('input', [
'name' => 'title',
'label' => 'Заголовок',
'translated' => true,
'maxlength' => 200
])

@formField('medias', [
'name' => 'icon',
'label' => 'Иконка',
'note' => 'SVG иконка'
])

@formField('repeater', ['type' => 'features_offered_item'])