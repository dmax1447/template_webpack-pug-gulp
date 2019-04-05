<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateHeroSlidesTables extends Migration
{
    public function up()
    {
        Schema::create('hero_slides', function (Blueprint $table) {
            
            // this will create an id, a "published" column, and soft delete and timestamps columns
            createDefaultTableFields($table);

            // use this column with the HasPosition trait
            $table->integer('position')->unsigned()->nullable();
        });

        // remove this if you're not going to use any translated field, ie. using the HasTranslation trait. If you do use it, create fields you want translatable in this table instead of the main table above. You do not need to create fields in both tables.
        Schema::create('hero_slide_translations', function (Blueprint $table) {
            createDefaultTranslationsTableFields($table, 'hero_slide');
            $table->string('header')->nullable();
            $table->string('text')->nullable();
            $table->string('cta_text')->nullable();
            $table->string('cta_link')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('hero_slide_translations');
        Schema::dropIfExists('hero_slides');
    }
}
