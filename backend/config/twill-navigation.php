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
    'feedback' => [
        'title' => 'Фидбэк',
        'module' => true
    ],
    'settings' => [
        'title' => 'Настройки',
        'route' => 'admin.settings',
        'params' => ['section' => 'site'],
        'primary_navigation' => [
            'site' => [
                'title' => 'Сайт',
                'route' => 'admin.settings',
                'params' => ['section' => 'site']
            ],
            'blocks' => [
                'title' => 'Блоки контента',
                'route' => 'admin.settings',
                'params' => ['section' => 'blocks']
            ],
        ]
    ]
];
