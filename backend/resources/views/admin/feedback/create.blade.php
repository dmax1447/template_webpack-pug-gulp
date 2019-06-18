@formField('input', [
'name' => $titleFormKey ?? 'title',
'label' => ucfirst($titleFormKey ?? 'title'),
'translated' => $translateTitle ?? false,
'required' => true,
'onChange' => 'formatPermalink'
])

@formField('input', [
'name' => 'phone',
'label' => 'Телефон',
'translated' => false,
'required' => true
])

@formField('input', [
'name' => 'email',
'label' => 'Email',
'translated' => false,
'required' => true
])

@if ($permalink ?? true)
    @formField('input', [
    'name' => 'slug',
    'label' => 'Permalink',
    'translated' => true,
    'ref' => 'permalink',
    'prefix' => $permalinkPrefix ?? ''
    ])
@endif
