<?php

namespace App\Providers;

use App\CroppaHandler;
use App\CroppaUrl;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        // Bind the Croppa URL generator and handler
        $this->app->singleton('Bkwld\Croppa\URL', function($app) {
            return new CroppaUrl($this->getConfig());
        });

        $this->app->singleton('Bkwld\Croppa\Handler', function($app) {
            return new CroppaHandler($app['Bkwld\Croppa\URL'],
                $app['Bkwld\Croppa\Storage'],
                $app['request'],
                $this->getConfig());
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    public function getConfig() {
        $config = $this->app->make('config')->get('croppa');

        // Use Laravel's encryption key if instructed to
        if (isset($config['signing_key']) && $config['signing_key'] == 'app.key') {
            $config['signing_key'] = $this->app->make('config')->get('app.key');
        }

        return $config;
    }
}
