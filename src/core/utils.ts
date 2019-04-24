export const $ = <T = HTMLDivElement>(x: string) => document.querySelector(x) as any as T;
export const $all = <T extends Element = HTMLDivElement>(x: string) => document.querySelectorAll<T>(x);
const DetectMobileBrowser = require("detect-mobile-browser")(false);

export function intersectionRect(rectA: ClientRect, rectB: ClientRect): { x: number, y: number, width: number, height: number }|false {
    const x = Math.max(rectA.left, rectB.left);
    const num1 = Math.min(rectA.left + rectA.width, rectB.left + rectB.width);
    const y = Math.max(rectA.top, rectB.top);
    const num2 = Math.min(rectA.top + rectA.height, rectB.top + rectB.height);

    if (num1 >= x && num2 >= y) {
        return {
            x,
            y,
            width: num1 - x,
            height: num2 - y,
        };
    } else {
        return false;
    }
}

/** in [0..1] range */
export function intersectionRate(rectA: ClientRect, rectB: ClientRect) {
    const rectI = intersectionRect(rectA, rectB);

    if (rectI === false) return 0;

    const rectAS = rectA.width * rectA.height;
    const rectIntS = rectI.width * rectI.height;

    return rectIntS / rectAS;
}

export function isGlobalRectInViewport(rect: ClientRect) {
    if (rect.top + rect.height < window.pageYOffset) return false;
    if (rect.top > window.pageYOffset + window.innerHeight) return false;
    if (rect.left + rect.width < window.pageXOffset) return false;
    if (rect.left > window.pageXOffset + window.innerWidth) return false;

    return true;
}

export function isElementInViewport(el: HTMLElement) {
    return isGlobalRectInViewport(getGlobalRect(el));
}

export function getGlobalRect(el: HTMLElement): ClientRect {
    const rect = el.getBoundingClientRect();
    return {
        width: rect.width,
        height: rect.height,
        bottom: rect.bottom + window.pageYOffset,
        right: rect.right + window.pageXOffset,
        left: rect.left + window.pageXOffset,
        top: rect.top + window.pageYOffset
    };
}

export function getWindowGlobalRect(): ClientRect {
    return {
        width: window.innerWidth,
        height: window.innerHeight,
        bottom: window.outerHeight - (window.pageYOffset + window.innerHeight),
        right: window.outerWidth - (window.pageXOffset + window.innerWidth),
        left: window.pageXOffset,
        top: window.pageYOffset
    };
}

/** is visible (doesnt check is on screen) */
export function isElementVisible(el: HTMLElement): boolean {
    return el.offsetWidth > 0 && el.offsetHeight > 0;
}

/**
 * Example:
 * 
 * ```ts
 * <Element onMouseDown={() => prepareDragging(
*      () => {
*          // start dragging
*      },
*      () => {
*          // just click
*      }
* )}
* ```
*/
export function prepareDragging<ArgT = any>(
    startDragging: (evt: MouseEvent, arg?: ArgT) => void,
    click: (evt: MouseEvent, arg?: ArgT) => void,
    deadZone: number = 4,
    arg?: ArgT
): Function {
       const handleMouseMove = (evt: MouseEvent) => {
           if (evt.movementX ** 2 + evt.movementY ** 2 < deadZone) return;
           evt.preventDefault();
           evt.stopPropagation();
           unregister();
           startDragging(evt, arg);
       };
       const handleMouseUp = (evt: MouseEvent) => {
           evt.preventDefault();
           evt.stopPropagation();
           unregister();
           click(evt, arg);
       };
   
       const unregister = () => {
           window.removeEventListener('mousemove', handleMouseMove);
           window.removeEventListener('mouseup', handleMouseUp);
       };
   
       window.addEventListener('mousemove', handleMouseMove);
       window.addEventListener('mouseup', handleMouseUp);
   
       return unregister;
}

/** rate of X's position between A & B  [A  ?  B] */
export function betweenRate(a: number, x: number, b: number) {
    return (x - a) / (b - a);
}

export function disableScroll() {
    document.body.style.overflow = 'hidden';
}

export function enableScroll() {
    document.body.style.overflow = null;
}

export function smoothScrollTo(el: HTMLElement, topOffset?: number) {
    if (!topOffset) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        window.scrollTo({
            top: getGlobalRect(el).top - topOffset,
            behavior: 'smooth',
        });
    }
    return sleep(400);
}

export function sleep(ms: number) {
    return new Promise<void>(resolve => setTimeout(() => resolve(), ms));
}

export function getScroll() {
    const doc = document.documentElement;
    const left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    const top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    return { left, top };
}

// ----------------------------
//           SWIPE
// ----------------------------

export function startDetectingScreenSwipe(
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

export function listenSwipe(
    el: HTMLElement|Window,
    onSwipe: (direction: 'up'|'down'|'left'|'right') => void,
    deadZone = 15,
): () => void {
    let lastActionDestroy: Function;

    const mouseDown = () => {
        lastActionDestroy = startDetectingScreenSwipe(onSwipe, undefined, deadZone);
    };

    const touchStart = () => {
        lastActionDestroy = startDetectingScreenSwipe(onSwipe, undefined, deadZone);
    };

    el.addEventListener('mousedown', mouseDown);
    el.addEventListener('touchstart', touchStart);

    const destroy = () => {
        if (lastActionDestroy) lastActionDestroy();
        el.removeEventListener('mousedown', mouseDown);
        el.removeEventListener('touchstart', touchStart);
    };

    return destroy;
}

// ----------------------------
//          END SWIPE
// ----------------------------

let __isMobileHookScreen: boolean|undefined = undefined;

export function isMobileScreen() {
    return (__isMobileHookScreen !== undefined && __isMobileHookScreen) || DetectMobileBrowser.isAny() || window.innerWidth <= 571;
}

export function __unsafe_setIsMobileScreen(hook: boolean) {
    __isMobileHookScreen = hook;
}

export function sendForm(url: string, form: HTMLFormElement, after: (isOk: boolean) => void) {
    formSubmitXHR(url, JSON.stringify(getFormData(form)), xhr => {
        if (xhr.status === 200) after(true);
        else after(false);
    });
}

export function formSubmitXHR(url: string, body: string, then: (xhr: XMLHttpRequest) => void) {
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

export function getFormData<T = { [field: string]: string }>(form: HTMLFormElement): T {
    const fieldNodes = form.querySelectorAll('input, textarea');
    const fields: HTMLInputElement[] = Array.prototype.slice.call(fieldNodes);
    return fields.reduce((sum, field) => field.name ? Object.assign(sum, { [field.name]: field.value }) : sum, {} as T);
}

export function detectTouch(
    touchDetected: () => void,
): () => void {
    const ontouch = () => {
        destroy();
        touchDetected();
    };

    const onpointer = (evt: PointerEvent) => {
        if (evt.pointerType !== 'mouse') {
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