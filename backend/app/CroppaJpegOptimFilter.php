<?php

namespace App;

use Bkwld\Croppa\Filters\FilterInterface;
use GdThumb;

class CroppaJpegOptimFilter implements FilterInterface {
    /**
     * @param \GdThumb $thumb
     *
     * @return \GdThumb $thumb
     */
    public function applyFilter(GdThumb $thumb) {
        return $thumb;
    }
}
