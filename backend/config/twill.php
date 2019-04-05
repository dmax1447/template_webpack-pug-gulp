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
