<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateFeedbackTables extends Migration
{
    public function up()
    {
        Schema::create('feedback', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('title', 200);
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->json('content')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('feedback');
    }
}
