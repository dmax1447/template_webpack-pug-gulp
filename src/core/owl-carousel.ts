import 'owl.carousel/distassets/owl.carousel.css';
import 'owl.carousel';

export function initCarousels() {
    ($('.owl-carousel') as any).owlCarousel({
        center: true,
        items: 1,
        loop:true,
        margin:40,
        autoWidth:true,
        dots: true,
        autoHeight:true,
        nav:true,
        responsive:{
            600: {
                items: 1,
            },
            2000: {
                items: 1,
            }
        }
    });
}