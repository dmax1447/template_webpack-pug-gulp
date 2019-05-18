<?php

return [
    'enabled' => [
        'settings' => true,
        'dashboard' => true,
    ],
    'block_editor' => [
        'blocks' => [
            'slide_item' => [
                'title' => 'Иконки слайда',
                'icon' => 'text',
                'component' => 'a17-block-slide_item',
            ],
            'image' => [
                'title' => 'Изображение',
                'icon' => 'image',
                'component' => 'a17-block-image',
            ],
            'features_offered' => [
                'title' => 'Блоки Предлагаем',
                'icon' => 'text',
                'component' => 'a17-block-features_offered',
            ],
            'project_step' => [
                'title' => 'Этапы проекта',
                'icon' => 'text',
                'component' => 'a17-block-project_step',
            ],
            'client_review' => [
                'title' => 'Отзыв клиента',
                'icon' => 'text',
                'component' => 'a17-block-client_review',
            ]
        ],
        'repeaters' => [
            'features_offered_item' => [
                'title' => 'Пункты',
                'trigger' => 'Добавить пункт',
                'component' => 'a17-block-features_offered_item',
                'max' => 10,
            ],
        ],
        'crops' => [
            'icons' => [
                'desktop' => [
                    [
                        'name' => 'desktop',
                        'ratio' => 1,
                    ],
                ]
            ],
            'icon' => [
                'desktop' => [
                    [
                        'name' => 'desktop',
                        'ratio' => 1,
                    ],
                ]
            ],
            'client_photo' => [
                'default' => [
                    [
                        'name' => 'desktop',
                        'ratio' => 1,
                    ],
                ]
            ],
            'image' => [
                'desktop' => [
                    [
                        'name' => 'desktop',
                        'ratio' => 16 / 9,
                        'minValues' => [
                            'width' => 100,
                            'height' => 100,
                        ],
                    ],
                ],
                'tablet' => [
                    [
                        'name' => 'tablet',
                        'ratio' => 4 / 3,
                        'minValues' => [
                            'width' => 100,
                            'height' => 100,
                        ],
                    ],
                ],
                'mobile' => [
                    [
                        'name' => 'mobile',
                        'ratio' => 1,
                        'minValues' => [
                            'width' => 100,
                            'height' => 100,
                        ],
                    ],
                ],
            ],
        ]
    ]];
