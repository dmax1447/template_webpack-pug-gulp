<?php

namespace App;

use Bkwld\Croppa\Handler;

class CroppaHandler extends Handler {
    /**
     * Render image directly
     *
     * @param string $request_path The `Request::path()`
     * @return string The path, relative to the storage disk, to the crop
     */
    public function render($request_path) {
        $crop_path = parent::render($request_path);
        $absolute_path = config('croppa.crops_dir') . '/' . $crop_path;
        $cmd = sprintf('jpegoptim -o -s -m%s --all-normal ' . escapeshellarg($absolute_path), config('app.jpegoptim_quality'));
        $res = exec($cmd);
        \Log::info($res);
        return $crop_path;
    }
}
