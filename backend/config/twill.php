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
            'translated_text' => [
                'title' => 'Текст1',
                'icon' => 'text',
                'component' => 'a17-block-translated_text',
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
            ],
            'team_groups' => [
                'title' => 'Блок Команды',
                'icon' => 'text',
                'component' => 'a17-block-team_group',
            ],
            'translated_header' => [
                'title' => 'Подзаголовок',
                'icon' => 'text',
                'component' => 'a17-block-translated_header',
            ],
            'technologies' => [
                'title' => 'Технологии',
                'icon' => 'text',
                'component' => 'a17-block-technologies',
            ],
            'tech_workflow' => [
                'title' => 'Как мы работаем',
                'icon' => 'text',
                'component' => 'a17-block-tech_workflow',
            ],
            'project_preview' => [
                'title' => 'Галерея',
                'icon' => 'text',
                'component' => 'a17-block-project_preview',
            ],
        ],
        'repeaters' => [
            'features_offered_item' => [
                'title' => 'Пункты',
                'trigger' => 'Добавить пункт',
                'component' => 'a17-block-features_offered_item',
                'max' => 10,
            ],
            'team_group_member' => [
                'title' => 'Члены команды',
                'trigger' => 'Добавить',
                'component' => 'a17-block-team_group_member',
                'max' => 10,
            ],
            'technology' => [
                'title' => 'Технология',
                'trigger' => 'Добавить',
                'component' => 'a17-block-technology',
                'max' => 30,
            ],
            'tech_workflow_item' => [
                'title' => 'Элемент',
                'trigger' => 'Добавить',
                'component' => 'a17-block-tech_workflow_item',
                'max' => 10,
            ],
            'project_preview_item' => [
                'title' => 'Превью',
                'trigger' => 'Добавить',
                'component' => 'a17-block-project_preview_item',
                'max' => 20,
            ]
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
            'avatar' => [
                'default' => [
                    [
                        'name' => 'desktop',
                        'ratio' => 1,
                    ],
                ]
            ],
            'image' => [
                'default' => [
                    [
                        'name' => 'default',
                        'ratio' => 1,
                    ],
                ],
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
