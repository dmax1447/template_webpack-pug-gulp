<?php

namespace App\Console\Commands;

use A17\Twill\Models\Block;
use A17\Twill\Models\Setting;
use App\Models\HeroSlide;
use App\Models\Page;
use App\Models\Project;
use Illuminate\Console\Command;

class ImportCaseGallery2Block extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bereza:import2block';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import old case gallery into blocks';

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
        $this->info("Complete");
        $cases = Project::all();

        foreach ($cases as $case) {
            $blocks = $case->blocks()->where('type', 'project_preview')->get();
            foreach ($blocks as $block) {
                foreach ($block->children as $fblock) {
                    $fblock->delete();
                }
                $block->delete();
            }

            $block = new Block(['type' => 'project_preview', 'position' => 5, 'content' => []]);
            $block->blockable()->associate($case);
            $block->save();

            $map = ['project_desktop' => 'pc', 'project_mobile' => 'mobile2', 'project_tablet' => 'mobile'];
            $pos = 0;
            foreach ($map as $role => $newRole) {
                $images = $case->medias()->where('role', $role)->get();
                if (!$images->count()) continue;

                $cnt = ['type' => $newRole];
                $cblock = new Block([
                    'type' => 'project_preview_item', 'child_key' => 'project_preview_item', 'parent_id' => $block->getKey(),
                    'position' => $pos + 1, 'content' => $cnt
                ]);
                $cblock->blockable()->associate($case)->save();
                // $cblock->medias()->attach($img->getKey(), ['role' => 'image', 'crop' => 'default', 'metadatas' => $img->pivot->metadatas]);

                foreach ($images as $img) {
                    $cblock->medias()->attach($img->getKey(), ['role' => 'image', 'crop' => 'default', 'metadatas' => $img->pivot->metadatas]);
                    //\Log::info($img->pivot->role);
                }
            }
/*
            foreach ($case->medias as $pos => $img) {
                if (!isset($map[$img->pivot->role])) continue;
                \Log::info($img->pivot->role);
                $cnt = ['type' => $map[$img->pivot->role]];
                $cblock = new Block([
                    'type' => 'project_preview_item', 'child_key' => 'project_preview_item', 'parent_id' => $block->getKey(),
                    'position' => $pos + 1, 'content' => $cnt
                ]);
                $cblock->blockable()->associate($case)->save();
                $cblock->medias()->attach($img->getKey(), ['role' => 'image', 'crop' => 'default', 'metadatas' => $img->pivot->metadatas]);
            }
*/
        }
    }
}
