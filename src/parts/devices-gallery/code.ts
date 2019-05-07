import { initCarousels } from '../../core/owl-carousel';

window.addEventListener('load', () => {
    initCarousels({
        nav: false,
        autoHeight: false,
        // loop: false,

        autoplay: true,
        autoplayTimeout: 10000,
        autoplaySpeed: 1000,
        autoplayHoverPause: true
    });
});