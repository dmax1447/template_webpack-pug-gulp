<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class RequestResult extends Mailable {
    use Queueable, SerializesModels;

    protected $result;

    public function __construct(\App\Models\Feedback $result) {
        $this->result = $result;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build() {
        return $this->view('emails.request-result', [
            'form' => 'Контакта',
            'site' => 'berezadev.com',
            'result' => $this->result,
        ]);
    }
}
