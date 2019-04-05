<?php

namespace App\Console\Commands;

use App\Models\HeroSlide;
use Illuminate\Console\Command;

class BuildSite extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bereza:build';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Build site from backend data';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle() {
        $slides = [];
        foreach ((array) config('translatable.locales') as $locale) {
            $slides[$locale] = $this->buildSlides($locale);
            \Storage::disk('local')->put('build/hero.' . $locale . '.json', json_encode($slides[$locale], JSON_UNESCAPED_UNICODE));
        }
        dump($slides);
    }

    protected function buildSlides($locale) {
        \App::setLocale($locale);

        $slides = HeroSlide::query()->published()->get();
        $data = [];
        foreach ($slides as $slide) {
            $s = [
                'id' => $slide->css_id,
                'title' => $slide->title,
                'header' => $slide->header,
                'text' => $slide->text,
                'cta' => [
                    'text' => $slide->cta_text,
                    'link' => $slide->cta_link,
                ],
                'icons' => []
            ];
            foreach ($slide->blocks as $block) {
                $i = ['title' => $block->translatedInput('title'), 'icons' => $block->images('icons', 'desktop')];
                $s['icons'][]= $i;
            }
            $data[] = $s;
        }
        return $data;
    }
}
