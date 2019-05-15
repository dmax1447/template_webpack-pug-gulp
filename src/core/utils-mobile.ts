const DetectMobileBrowser = require("detect-mobile-browser")(false);

export function detectTouch(
    touchDetected: () => void,
): () => void {
    const ontouch = () => {
        destroy();
        touchDetected();
    };

    const onpointer = (evt: PointerEvent) => {
        if (evt.pointerType === 'mouse') {
            // destroy pointer handler coz its too expensive
            window.removeEventListener('pointerdown', onpointer);
            window.removeEventListener('pointermove', onpointer);
        } else {
            ontouch();
        }
    };

    window.addEventListener('touchstart', ontouch);
    window.addEventListener('touchmove', ontouch);
    window.addEventListener('pointerdown', onpointer);
    window.addEventListener('pointermove', onpointer);

    const destroy = () => {
        window.removeEventListener('touchstart', ontouch);
        window.removeEventListener('touchmove', ontouch);
        window.removeEventListener('pointerdown', onpointer);
        window.removeEventListener('pointermove', onpointer);
    };

    return destroy;
}


let __isMobileHookScreen: boolean|undefined = undefined;

export function isMobileScreen() {
    return (__isMobileHookScreen !== undefined && __isMobileHookScreen) || DetectMobileBrowser.isAny() || window.innerWidth <= 571;
}

export function __unsafe_setIsMobileScreen(hook: boolean) {
    __isMobileHookScreen = hook;
}

// ----------------------------
//           SWIPE
// ----------------------------

function _detectingScreenSwipe(
    onSwipe: (direction: 'up'|'down'|'left'|'right') => void,
    onCancel?: () => void,
    deadZone = 15,
) {
    let initialPos: undefined|{ x: number, y: number };

    const mouseMove = (ev: MouseEvent) => {
        initialPos = {
            x: ev.clientX,
            y: ev.clientY,
        };
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('touchmove', touchMove);
    };

    const touchMove = (ev: TouchEvent) => {
        initialPos = {
            x: ev.touches[0].clientX,
            y: ev.touches[0].clientY,
        };
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('touchmove', touchMove);
    };

    const mouseUp = (ev: MouseEvent) => {
        ended(ev.clientX, ev.clientY);
    };

    const touchEnd = (ev: TouchEvent) => {
        ended(ev.changedTouches[0].clientX, ev.changedTouches[0].clientY);
    };

    const ended = (clientX: number, clientY: number) => {
        destroy();

        if (!initialPos) {
            if (onCancel) onCancel();
            return;
        }

        const deltaX = clientX - initialPos.x;
        const deltaY = clientY - initialPos.y;

        if (deltaX * deltaX + deltaY*deltaY < deadZone * deadZone) return;

        // horizontal
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < 0) onSwipe('left');
            else onSwipe('right');
        }
        // vertical
        else {
            if (deltaY < 0) onSwipe('up');
            else onSwipe('down');
        }
    };

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseup', mouseUp);

    window.addEventListener('touchmove', touchMove);
    window.addEventListener('touchend', touchEnd);

    const destroy = () => {
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('mouseup', mouseUp);

        window.removeEventListener('touchmove', touchMove);
        window.removeEventListener('touchend', touchEnd);
    };

    return destroy;
}

export type SwipeListener = (direction: 'up'|'down'|'left'|'right') => void;

export function listenSwipe(
    el: HTMLElement|Window,
    onSwipe: SwipeListener,
    deadZone = 15,
): () => void {
    let lastActionDestroy: Function;

    const mouseDown = () => {
        if (lastActionDestroy) lastActionDestroy();
        lastActionDestroy = _detectingScreenSwipe(onSwipe, undefined, deadZone);
    };

    const touchStart = () => {
        if (lastActionDestroy) lastActionDestroy();
        lastActionDestroy = _detectingScreenSwipe(onSwipe, undefined, deadZone);
    };

    el.addEventListener('mousedown', mouseDown);
    el.addEventListener('touchstart', touchStart);

    const destroy = () => {
        el.removeEventListener('mousedown', mouseDown);
        el.removeEventListener('touchstart', touchStart);
        if (lastActionDestroy) lastActionDestroy();
    };

    return destroy;
}

// ----------------------------
//          END SWIPE
// ----------------------------
