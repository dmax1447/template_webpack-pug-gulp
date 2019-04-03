export const $ = <T = HTMLDivElement>(x: string) => document.querySelector(x) as any as T;
export const $all = <T extends Element = HTMLDivElement>(x: string) => document.querySelectorAll<T>(x);

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

export function smoothScrollTo(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}