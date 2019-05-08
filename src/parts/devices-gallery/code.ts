import { singleCarouselFade } from "../../core/carousel";

// You should include this code manually

window.addEventListener('load', () => {
    document.querySelectorAll<HTMLElement>('.devices-gallery').forEach(el => {
        singleCarouselFade(el);
    });
});