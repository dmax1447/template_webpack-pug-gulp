<?php

namespace App\Repositories;

use A17\Twill\Repositories\Behaviors\HandleFiles;
use A17\Twill\Repositories\ModuleRepository;
use A17\Twill\Repositories\SettingRepository as BaseSettingRepository;
use App\Models\Setting;

class SettingRepository extends BaseSettingRepository
{
    use HandleFiles;

    public function __construct(Setting $model)
    {
        parent::__construct($model);
    }

    public function getFormFields($section = null)
    {
        $fields = parent::getFormFields($section);

        $settings = $this->model->when($section, function ($query) use ($section) {
            $query->where('section', $section);
        })->with('files')->get();

        $files = [];
        $settings->each(function($setting) use (&$files){
            $ff = ModuleRepository::getFormFields($setting)['files'] ?? [];
            foreach ($ff as $locale => $ffs) {
                $ff3 = collect($ffs)->mapWithKeys(function($el, $key) {
                    return ['medias[' . $key . ']' => $el];
                });
                if (isset($files[$locale])) {
                    $files[$locale] = array_merge($files[$locale], $ff3->toArray());
                } else {
                    $files[$locale] = $ff3->toArray();
                }
            }
        });

        return array_merge($fields, ['files' => $files]);
    }

    public function saveAll($settingsFields, $section = null)
    {
        $section = $section ? ['section' => $section] : [];
        $settingsTranslated = [];
        $settings = [];

        foreach (collect($settingsFields)->except('active_languages', 'medias', 'mediaMeta')->filter() as $key => $value) {
            foreach (getLocales() as $locale) {
                array_set(
                    $settingsTranslated,
                    $key . '.' . $locale,
                    [
                        'value' => is_array($value)
                            ? (array_key_exists($locale, $value) ? $value[$locale] : $value)
                            : $value,
                    ] + ['active' => true]
                );
            }
        }

        foreach ($settingsTranslated as $key => $values) {
            array_set($settings, $key, ['key' => $key] + $section + $values);
        }

        foreach ($settings as $key => $setting) {
            $this->model->updateOrCreate(['key' => $key] + $section, $setting);
        }

        foreach ($settingsFields['medias'] ?? [] as $role => $mediasList) {
            $medias = [];
            collect($settingsFields['medias'][$role])->each(function($media, $locale) use (&$medias, $role) {
                $k = $role . '[' . $locale . ']';
                $medias[$k][] = ['id' => $media];
            });
            $this->updateOrCreate($section + ['key' => $role], $section + [
                    'key' => $role,
                    'medias' => $medias
                ]);
        }
    }
}
