<?php

namespace App\Repositories;


use A17\Twill\Repositories\ModuleRepository;
use App\Models\Feedback;

class FeedbackRepository extends ModuleRepository
{
    

    public function __construct(Feedback $model)
    {
        $this->model = $model;
    }

    public function getCountForTrash() {
        return 0;
    }
}
