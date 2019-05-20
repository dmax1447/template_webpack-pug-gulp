<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSlideOthers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('hero_slides', function (Blueprint $table) {
            $table->string('video')->nullable();
            $table->string('backgroundStyle')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('hero_slides', function (Blueprint $table) {
            $table->dropColumn('video');
            $table->dropColumn('backgroundStyle');
        });
    }
}
