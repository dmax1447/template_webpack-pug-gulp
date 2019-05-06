import './index.scss';
import { $all } from '../../core/utils';

if (process.env.BUILD === 'prod') {
    require('./no-rem.scss');
}

window.addEventListener('load', () => {
    $all('.case-thumbnail').forEach(el => {
        let loaded = false;

        const mouseEnter = () => {
            const videoEl = el.querySelector('video')!;
            if (!loaded) {
                const sourceEl = videoEl.querySelector('source')!;
                sourceEl.src = sourceEl.getAttribute('-data-src')!;
                videoEl.load();
                loaded = true;
            }
            videoEl.currentTime = 0;
            videoEl.play().catch();
        };

        const mouseLeave = () => {
            const videoEl = el.querySelector('video')!;
            videoEl.pause();
        };

        el.addEventListener('mouseenter', mouseEnter);
        el.addEventListener('mouseleave', mouseLeave);
        el.addEventListener('click', mouseEnter);
    });
});