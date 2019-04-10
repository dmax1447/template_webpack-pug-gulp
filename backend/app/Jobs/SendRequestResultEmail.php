<?php

namespace App\Jobs;

use App\Models\Feedback;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class SendRequestResultEmail implements ShouldQueue {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $result;

    public function __construct(Feedback $result) {
        $this->result = $result;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle() {
        $mail = (new \App\Mail\RequestResult($this->result))->subject(config('app.contact.subject'));
        \Log::info([config('app.contact.to'), config('app.contact.subject')]);
        \Mail::to(config('app.contact.to'))->send($mail);
    }
}
