<?php

namespace App;

use Bkwld\Croppa\URL;

/**
 * Class CroppaUrl
 * @package App
 *
 * Add resize filter to croppa images
 */
class CroppaUrl extends URL {
    /**
     * Parse a request path into Croppa instructions
     *
     * @param string $request
     * @return array | boolean
     */
    public function parse($request) {
        if (!preg_match('#'.self::PATTERN.'#', $request, $matches)) return false;

        if (config('app.force_croppa_filters')) {
            $matches[4] = '-resize';
        }
        return [
            $this->relativePath($matches[1].'.'.$matches[5]), // Path
            $matches[2] == '_' ? null : (int) $matches[2],    // Width
            $matches[3] == '_' ? null : (int) $matches[3],    // Height
            $this->options($matches[4]),                      // Options
        ];
    }
}
