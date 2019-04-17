// --------------------------------
//      EVERY PAGE SHARED CODE
// --------------------------------

import smoothscroll from 'smoothscroll-polyfill';

import {
    $ as $q, $all,
} from './core/utils';
import { initAnimations, runAnimation, pickAnimParams, isAnimPlaying, isAnimStopped } from './core/anim';
import { initCarousels } from './core/owl-carousel';
import { remFix } from './core/rem-fix';

initAnimations();

window.onload = () => {
    // init smoothscroll
    smoothscroll.polyfill();

    let skipScrollEvents = false;

    // setup nav with smoothscroll
    $all<HTMLAnchorElement>('a[href]').forEach(el => {
        if (!el.hash) return;
        
        el.onclick = evt => {
            evt.preventDefault();

            skipScrollEvents = true;
            setTimeout(() => {
                skipScrollEvents = false;
                // updateScrollStates();
            }, 1000);

            document.querySelector(el.hash)!.scrollIntoView({
                block: 'start',
                behavior: 'smooth' 
            });
        };
    });

    // initCarousels();

    $q('form.feedback-form').onsubmit = (evt) => {
        evt.preventDefault();

        sendForm('/contact', evt.target! as any, (isOk) => {
            if (isOk) alert('Мы с вами свяжемся!');
            else alert('Произошла ошибка');
        });
    };
};

function sendForm(url: string, form: HTMLFormElement, after: (isOk: boolean) => void) {
    formSubmitXHR(url, JSON.stringify(getFormData(form)), xhr => {
        if (xhr.status === 200) after(true);
        else after(false);
    });
}

function formSubmitXHR(url: string, body: string, then: (xhr: XMLHttpRequest) => void) {
    const xhr = new XMLHttpRequest();
  
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/json');
  
    xhr.onreadystatechange = function(this: XMLHttpRequest) {
      if (this.readyState != 4) return;
      then(xhr);
    };
  
    xhr.send(body);
}

function getFormData<T = { [field: string]: string }>(form: HTMLFormElement): T {
    const fieldNodes = form.querySelectorAll('input, textarea');
    const fields: HTMLInputElement[] = Array.prototype.slice.call(fieldNodes);
    return fields.reduce((sum, field) => field.name ? Object.assign(sum, { [field.name]: field.value }) : sum, {} as T);
}