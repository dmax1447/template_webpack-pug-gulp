import './index.scss';

if (process.env.BUILD === 'prod') {
    require('./no-rem.scss');
}

import { Hero } from './hero';
import {
    $ as $q, isMobileScreen, detectTouch, __unsafe_setIsMobileScreen,
} from '../../core/utils';
import { AnchorNav } from './anchor-nav';
import { AnchorNavControls } from './anchor-nav-controls';

let heroChanging = false;

const hero = new Hero({
    onEnterHero: () => {},
    onLeaveHero: async (nextAnchor) => {
        if (heroChanging) return;

        heroChanging = true;
        if (nextAnchor) {
            await anchorNav.setCurrentAnchor(anchorNav.anchors.findIndex(x => x.hash === nextAnchor), 'force');
        } else {
            if (!isMobileScreen()) {
                await anchorNav.setCurrentAnchor(1, 'force');
            }
        }
        heroChanging = false;
    },
});
console.log(hero);

const anchorNav = new AnchorNav([
    {
        hash: "hero",
        selector: '#hero',
        onEnter: () => hero.enterHeroMode(),
    },
    {
        hash: 'we-help',
        selector: '.features__we-help-items'
    },
    {
        hash: 'we-offer',
        selector: '.features__we-offer-items'
    },
    {
        hash: 'feedback',
        selector: '#feedback'
    },
]);

const anchorControls = new AnchorNavControls(hero, anchorNav);

function fixScrollHelpAnimForSafari() {
    $q('.mouse-help-icon__wheel').style.animation = 'none';
    $q('.mouse-help-icon__wheel').style.webkitAnimation = 'none';

    setTimeout(() => {
        $q('.mouse-help-icon__wheel').style.animation = '';
        $q('.mouse-help-icon__wheel').style.webkitAnimation = '';
    }, 100);
}

async function resetAnchor() {
    if (hero.isHeroMode) anchorNav.currentAnchorIndex = 0;
    else {
        const curAnch = anchorNav.getCurrentAnchor();
        if (!curAnch) {
            anchorNav.currentAnchorIndex = 0;
            await anchorNav.setCurrentAnchor(0, 'force');
            hero.enterHeroMode();
            return;
        }
    }
    await anchorNav.setCurrentAnchor(anchorNav.currentAnchorIndex, 'force');
}

function handleWindowResize() {
    console.log('resize');
    anchorControls.reset();
    hero.reset();
    resetAnchor();
}

function setup() {
    fixScrollHelpAnimForSafari();
    hero.init();
    anchorControls.init();
    resetAnchor();

    if (!isMobileScreen()) {
        detectTouch(() => {
            __unsafe_setIsMobileScreen(true);
            handleWindowResize();
        });
    }
}

window.addEventListener('load', setup);

let resizeTimeout: any;
window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleWindowResize, 1000);
});