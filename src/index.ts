// --------------------------------
//      EVERY PAGE SHARED CODE
// --------------------------------

import smoothscroll from 'smoothscroll-polyfill';

import {
    $ as $q, $all, sendForm,
} from './core/utils';
import { initAnimations, runAnimation, pickAnimParams, isAnimPlaying, isAnimStopped } from './core/anim';
import { initCarousels } from './core/owl-carousel';
import { remFix } from './core/rem-fix';
import { loadAllLazied } from './core/lazy';

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

    loadAllLazied();
};
