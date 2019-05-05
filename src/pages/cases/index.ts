import './index.scss';
import { $all } from '../../core/utils';

if (process.env.BUILD === 'prod') {
    require('./no-rem.scss');
}

window.addEventListener('load', () => {
    $all('.case-thumbnail').forEach(el => {
        let loaded = false;

        const mouseEnter = () => {
            if (!loaded) {
                const sourceEl = el.querySelector('video > source')! as HTMLSourceElement;
                sourceEl.src = sourceEl.getAttribute('-data-src')!;
                const videoEl = el.querySelector('video')!;
                videoEl.load();
                loaded = true;
                videoEl.play().catch();
            }
        };

        el.addEventListener('mouseenter', mouseEnter);
        el.addEventListener('click', mouseEnter);
    });
});