// --------------------------------
//      EVERY PAGE SHARED CODE
// --------------------------------

import smoothscroll from 'smoothscroll-polyfill';

import {
    $q, $all, sendForm,
} from './core/utils';
import { initAnimations } from './core/anim';
import { initCarousels } from './core/owl-carousel';
import { remFix } from './core/rem-fix';
import { loadAllLazied } from './core/lazy';

remFix();
initAnimations();

window.onload = () => {
    // init smoothscroll
    smoothscroll.polyfill();

    // setup nav with smoothscroll
    $all<HTMLAnchorElement>('a[href]').forEach(el => {
        if (!el.hash) return;
        
        el.onclick = evt => {
            evt.preventDefault();

            document.querySelector(el.hash)!.scrollIntoView({
                block: 'start',
                behavior: 'smooth' 
            });
        };
    });

    // initCarousels();

    $all('form.feedback-form').forEach(f => {
        f.onsubmit = (evt) => {
            evt.preventDefault();
    
            sendForm('/contact', evt.target! as any, (isOk) => {
                if (isOk) alert('Мы с вами свяжемся!');
                else alert('Произошла ошибка');
            });
        };
    });

    loadAllLazied();
};
