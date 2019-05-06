import { initCarousels } from '../../core/owl-carousel';

window.addEventListener('load', () => {
    initCarousels({
        nav: false,
        autoHeight: false,

        autoplay: true,
        autoplayTimeout: 4000,
        autoplaySpeed: 1000,
        autoplayHoverPause: true
    });
});