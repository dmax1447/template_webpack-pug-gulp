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
// import { initHero } from './views/main/hero';

window.onload = () => {
    // init smoothscroll
    smoothscroll.polyfill();

    let skipScrollEvents = false;

    // initHero();

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

    // // setup hero
    // $('.top-bar__mobile-menu').onclick = () => {
    //     $('.top-bar-menu').classList.toggle('top-bar-menu--closed');
    // };
    // $('.top-bar__mobile-menu-close').onclick = () => {
    //     $('.top-bar-menu').classList.toggle('top-bar-menu--closed', true);
    // };
    // $all('.top-bar-menu a').forEach(el => {
    //     el.addEventListener('click', () => {
    //         $('.top-bar-menu').classList.toggle('top-bar-menu--closed', true);
    //     });
    // });

    // // setup mclass list items
    // $all('.mclass-list li').forEach(el => {
    //     el.addEventListener('click', () => {
    //         el.classList.toggle('mclass-list__item--open');

    //         setTimeout(() => {
    //             // turn off all other
    //             $all('.mclass-list li').forEach(x => {
    //                 if (el === x) return;
    //                 x.classList.toggle('mclass-list__item--open', false);
    //             });
    //         }, 600);
    //     });
    // });

    // function updateScrollStates() {
    //     const sy = window.pageYOffset;
    //     const th = document.body.getBoundingClientRect().height;
    //     const r = sy / th;

    //     // show bottom panel
    //     if (0.14 < r && r < 0.45) {
    //         $('.bottom-panel').classList.toggle('bottom-panel--hidden', false);
    //     } else {
    //         $('.bottom-panel').classList.toggle('bottom-panel--hidden', true);
    //     }

    //     // fix show hero animation
    //     if (0.1 > r) {
    //         $all('.hero-left.anim, .hero-right.anim').forEach(el => {
    //             if (isAnimPlaying(el) || isAnimStopped(el)) return;
    //             runAnimation(el, pickAnimParams(el));
    //         });
    //     }
    // }

    // updateScrollStates();

    // // bottom popup
    // let updateScrollStatesTimeout;
    // window.addEventListener('scroll', () => {
    //     if (skipScrollEvents) return;
    //     if (updateScrollStatesTimeout) {
    //         clearTimeout(updateScrollStatesTimeout);
    //     }
    //     updateScrollStatesTimeout = setTimeout(updateScrollStates, 50);
    // });

    // // overlays
    // $all('.overlay').forEach(overlay => {
    //     const closeEls = overlay.querySelectorAll('.overlay__close, .overlay-backdrop');
    //     closeEls.forEach((closeEl: any) => {
    //         closeEl.onclick = () => {
    //             overlay.classList.toggle('overlay--closed', true);
    //         };
    //     });
    // });

    // // close video-overlay
    // $all('.video-overlay').forEach(el => {
    //     const els = el.querySelectorAll('.video-overlay__backdrop, .video-overlay__close');
    //     els.forEach((x: any) => {
    //         x.onclick = () => {
    //             el.classList.toggle('video-overlay--closed', true);
    //             (el.querySelector('.speaker-video-overlay video') as any).pause();
    //         };
    //     });
    // });

    // initCarousels();
};

Object.assign(window, {
    tryAnimateHero() {
        // setTimeout(() => {
        //     const sy = window.pageYOffset;
        //     const th = document.body.getBoundingClientRect().height;
        //     const r = sy / th;
    
        //     if (0.1 > r) {
        //         $all('.hero-left.anim, .hero-right.anim').forEach(el => {
        //             if (isAnimPlaying(el) || isAnimStopped(el)) return;
        //             runAnimation(el, pickAnimParams(el));
        //         });
        //     }
        // }, 300);
    }
});

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