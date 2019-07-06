@formField('select', [
'name' => 'type',
'label' => 'Тип превью',
'default' => 'pc',
'options' => [
['value' => 'pc', 'label' => 'Десктоп'],
['value' => 'mobile', 'label' => 'Планшет'],
['value' => 'mobile2', 'label' => 'Мобилка веб-версия (2 картинки)'],
['value' => 'ios', 'label' => 'iPhone App'],
['value' => 'android', 'label' => 'Android App'],
]])

@formField('medias', [
'name' => 'image',
'label' => 'Изображение',
'max' => 2
])
