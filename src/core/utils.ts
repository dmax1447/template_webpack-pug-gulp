import { isMobileScreen } from './utils-mobile';

export const $q = <T = HTMLDivElement>(x: string) => document.querySelector(x) as any as T;
export const $all = <T extends Element = HTMLDivElement>(x: string) => document.querySelectorAll<T>(x);

export * from './utils-mobile';

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

export function listenWindowResize(handler: (evt: UIEvent) => void, resizeTimeoutMS = 500) {
    let resizeTimeout: any;
    let oldWidth = window.innerWidth;

    const onResize = (evt: UIEvent) => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, resizeTimeoutMS, evt);
    };

    const handleResize = (evt: UIEvent) => {
        resizeTimeout = 0;
        if (isMobileScreen()) {
            // there is a "feature" on mobile devices because of top bar, when scrolling vertically, 'resize' gets triggered
            const newWidth = window.innerWidth;
            if (oldWidth === newWidth) return;
            oldWidth = newWidth;
        }
        handler(evt);
    };

    window.addEventListener('resize', onResize);
    const destroy = () => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        window.removeEventListener('resize', onResize);
    };

    return destroy;
}
