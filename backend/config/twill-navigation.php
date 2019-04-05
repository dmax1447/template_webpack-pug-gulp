<?php

return [
    'HeroSlides' => [
        'title' => 'Hero Слайды',
        'module' => true
    ],
    'pages' => [
        'title' => 'Страницы',
        'module' => true
    ],
    'settings' => [
        'title' => 'Настройки',
        'route' => 'admin.settings',
        'params' => ['section' => 'site'],
        'primary_navigation' => [
            'section_name' => [
                'title' => 'Сайт',
                'route' => 'admin.settings',
                'params' => ['section' => 'site']
            ],
        ]
    ]
];
