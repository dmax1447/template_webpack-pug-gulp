import './index.scss';

if (process.env.BUILD === 'prod') {
    require('./no-rem.scss');
}

import '../../parts/devices-gallery/code';
import { $q } from '../../core/utils';

window.addEventListener('load', () => {
    const rp = $q('.result__previews');
    rp.addEventListener('mouseenter', () => {
        rp.classList.add('result__previews--hovered');
    });
    rp.addEventListener('mouseleave', () => {
        rp.classList.remove('result__previews--hovered');
    });
});