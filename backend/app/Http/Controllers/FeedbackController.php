<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use App\Jobs\SendRequestResultEmail;

class FeedbackController extends Controller {
    public function index(Request $request) {
        $validator = $this->buildValidator();
        //$this->validate($request, $validator);
        if ($request->input('work')) {
            //return ['success' => true, 'message' => config('contact.success')];
        }
        $result = $this->store($request);
        $this->dispatch(new SendRequestResultEmail($result));

        return ['success' => true, 'message' => 'success'];
    }

    protected function buildValidator() {
        $validator = [];
        $validator['name'] = 'required|string|min:3';
        $validator['phone'] = 'required|string|min:7';
        $validator['email'] = 'required|email';
        return $validator;
    }

    /**
     * Store request result
     * @param Request $request
     * @return Feedback
     */
    protected function store(Request $request) {
        $result = new Feedback($request->only(['name', 'email', 'phone']));
        $result->title = 'contact';
        $result->content = ['message' => $request->input('message')];
        $result->save();
        return $result;
    }
}
