<?php

namespace App\Console\Commands;

use A17\Twill\Models\Setting;
use App\Models\HeroSlide;
use App\Models\Page;
use App\Models\Project;
use Illuminate\Console\Command;

class BuildSite extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bereza:build {--commit-content} {--build}';

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
        // pull git updates
        if ($this->option('commit-content')) {
            \Log::info("Pulling  content");
            $this->info("Pulling  content");
            exec('cd '. base_path(). '/content-repo && git pull', $out, $err);
            \Log::info(join("\n", $out));
        }

        $slides = [];
        $blocks = [];
        $this->info("Collecting data");
        \Storage::disk('local')->deleteDirectory('build', true);
        foreach ((array) config('translatable.locales') as $locale) {
            $slides[$locale] = $this->buildSlides($locale);
            \Storage::disk('local')->put('build/hero.' . $locale . '.json', json_encode($slides[$locale], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
            $blocks[$locale] = $this->buildBlocks($locale);
            \Storage::disk('local')->put('build/blocks.' . $locale . '.json', json_encode($blocks[$locale], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
            $pages = $this->buildPages($locale);
            foreach ($pages as $page) {
                \Storage::disk('local')->put('build/page_' . $page['slug']. '.' . $locale . '.json', json_encode($page, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
            }
            $cases = $this->buildCases($locale);
            $casesAll = collect($cases)->map(function($el) {
                return collect($el)->only(['slug', 'title', 'tech', 'lead', 'cover', 'cover_video']);
            });
            \Storage::disk('local')->put('build/cases.'  . $locale . '.json', json_encode($casesAll, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
            foreach ($cases as $case) {
                \Storage::disk('local')->put('build/case_' . $case['slug']. '.' . $locale . '.json', json_encode($case, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
            }
        }

        if ($this->option('build')) {
            \Log::info("Compiling pages at " . base_path());
            exec('cd '. base_path(). ' && export PATH=/usr/local/bin:/usr/bin:/bin && BUILD_LANG=ru npm --scripts-prepend-node-path=auto run build-on-vps 2>&1', $out, $err);
            \Log::info(join("\n", $out));
            $this->info(join("\n", $out));
        }

        if ($this->option('commit-content')) {
            \Log::info("Pushing content");
            $this->info("Pushing content");
            exec('cp ' . storage_path('app/build/') . '*.json '. base_path(). '/content-repo', $out, $err);
            exec('cd '. base_path(). '/content-repo && git add . && git commit -m "content build update" && git push', $out, $err);
            \Log::info(join("\n", $out));
        }
        $this->info("Complete");
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
                'video' => $slide->video,
                'backgroundStyle' => $slide->backgroundStyle,
                'icons' => []
            ];
            foreach ($slide->blocks as $block) {
                $i = ['title' => $block->translatedInput('title'), 'icons' => $block->images('icons', 'desktop'), 'number' => $block->input('number')];
                $s['icons'][]= $i;
            }
            $data[] = $s;
        }
        return $data;
    }

    protected function buildBlocks($locale) {
        \App::setLocale($locale);
        $set = Setting::query()->where('section', 'blocks')->get();
        $data = [];
        foreach ($set as $s) {
            $data[$s->key] = $s->value;
        }
        return $data;
    }

    protected function buildPages($locale) {
        \App::setLocale($locale);
        $pages = Page::query()->published()->get();
        $data = [];
        foreach ($pages as $p) {
            //dump($p);
            $s = [
                'slug' => $p->getSlug('en') | $p->getSlug('ru'),
                'title' => $p->title,
                'content' => $p->content
            ];

            // для главной features
            if ($s['slug'] == 'main') {
                $s['features_offered'] = [];
                $p->blocks->where('type', 'features_offered')->each(function($feature) use(&$s) {
                    $f = [
                        'title' => $feature->translatedInput('title'),
                        'icon' => $feature->image('icon', 'desktop'),
                        'items' => []
                    ];

                    foreach ($feature->children as $fblock) {
                        $f['items'][] = [
                            'title' => $fblock->translatedInput('title'),
                            'fa-icon' => $fblock->input('icon'),
                        ];
                    }
                    $s['features_offered'][] = $f;
                    //dump($el);
                });
            }
            if ($s['slug'] == 'team') {
                $s['end_text'] = '';
                $b0 = $p->blocks->where('type', 'translated_text')->first();
                if ($b0) {
                    $s['end_text'] = $b0->translatedInput('content');
                }
                $s['leads'] = [];
                $p->blocks->where('type', 'team_groups')->each(function($feature) use(&$s) {
                    $f = [
                        'key' => $feature->input('key'),
                        'category' => $feature->translatedInput('category'),
                        'name' => $feature->translatedInput('name'),
                        'job' => $feature->translatedInput('job'),
                        'spec' => $feature->translatedInput('spec'),
                        'text' => $feature->translatedInput('text'),
                        'alsoHeader' => $feature->translatedInput('alsoHeader'),
                        'icon' => $feature->image('icon', 'desktop'),
                        'members' => []
                    ];

                    foreach ($feature->children as $fblock) {
                        $f['members'][] = [
                            'name' => $fblock->translatedInput('name'),
                            'job' => $fblock->translatedInput('job'),
                            'avatar' => $fblock->image('avatar'),
                        ];
                    }
                    $s['leads'][] = $f;
                });
            }
            $data[] = $s;
        }
        return $data;
    }

    protected function buildCases($locale) {
        \App::setLocale($locale);
        $cases = Project::query()->published()->get();
        $data = [];
        foreach ($cases as $case) {
            $c = [
                'slug' => $case->project_slug,
                'title' => $case->title,
                'url' => $case->url,
                'tech' => $case->tech,
                'lead' => $case->lead,
                'description' => $case->description,
                'cover' => $case->image('project_cover', 'desktop'),
                'cover_video' => $case->file('video_preview'),
                'makeup' => $case->makeup,
                'goal' => $case->goal,
                'result' => $case->result,
                'gallery' => [],
                'results_gallery' => []
            ];
            $images = $case->images('project_desktop', 'default');
            foreach ($images as $img) {
                $c['gallery'][] = ['type' => 'pc', 'img' => $img, 'mobileAddress' => parse_url($c['url'], PHP_URL_HOST)];
            }
            $chunks = array_chunk($case->images('project_mobile', 'default'), 2);
            foreach ($chunks as $images) {
                $g = ['type' => 'mobile2'];
                foreach ($images as $k =>$img) {
                    $g['img' . ($k ? ($k + 1) : '')] = $img;
                    $g['mobileAddress' . ($k ? ($k + 1) : '')] = parse_url($c['url'], PHP_URL_HOST);
                }
                $c['gallery'][] = $g;
            }
            $images = $case->images('project_tablet', 'default');
            foreach ($images as $img) {
                $c['gallery'][] = ['type' => 'mobile', 'img' => $img, 'mobileAddress' => parse_url($c['url'], PHP_URL_HOST)];
            }
            $c['results_gallery'] = $case->images('project_result', 'default');

            $case->blocks->where('type', 'project_step')->each(function($block) use(&$c) {
                $c['steps'][] = ['title' => $block->translatedInput('title'), 'content' => $block->translatedInput('content')];
            });
            $case->blocks->where('type', 'client_review')->each(function($block) use(&$c) {
                $c['client_review']= ['client_name' => $block->translatedInput('client_name'),
                    'client_position' => $block->translatedInput('client_position'),
                    'client_photo' => $block->image('client_photo', 'default'),
                    'client_review' => $block->translatedInput('client_review'),
                ];
            });
            $data[] = $c;
        }
        return $data;
    }
}
