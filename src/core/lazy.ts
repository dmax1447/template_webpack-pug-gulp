import { $all } from "./utils";

export const LAZY_ATTR_NAME = '-lazy-attr';
export const LAZY_ATTR_VALUE = '-lazy-value';
export const LAZY_SRC = '-lazy-src';
export const LAZY_HREF = '-lazy-href';
/** fade in time */
export const LAZY_ATTR_DELAY = '-lazy-delay';
/** timeout before loading starts, in seconds */
export const LAZY_ATTR_TIMEOUT = '-lazy-timeout';
export const LAZY_DEFAULT_DELAY = '1s';

export function loadAllLazied() {
    function lazyLoad(target: HTMLElement, attrName: string, attrValue: string) {
        target.setAttribute(attrName, attrValue);
        target.removeAttribute(LAZY_ATTR_NAME);
        target.removeAttribute(LAZY_ATTR_VALUE);
        target.removeAttribute(LAZY_SRC);

        if (target.parentElement && target.tagName.toLowerCase() === 'source') {
            if ('load' in (target.parentElement as any) && typeof (target.parentElement as any)['load'] === 'function') {
                (target.parentElement as any)['load']();
            }
        }
    }

    $all(`[${LAZY_ATTR_NAME}][${LAZY_ATTR_VALUE}], [${LAZY_SRC}], [${LAZY_HREF}]`).forEach((el: HTMLElement) => {
        let name: string|undefined, val: string|undefined;

        attrsSearch: for (let i = 0; i < el.attributes.length; ++i) {
            const attr = el.attributes.item(i)!;
            if (attr.name === LAZY_ATTR_NAME) {
                name = attr.value;
            }
            if (attr.name === LAZY_ATTR_VALUE) {
                val = attr.value;
            }
            if (attr.name === LAZY_SRC) {
                name = 'src';
                val = attr.value;
                break attrsSearch;
            }
            if (attr.name === LAZY_HREF) {
                name = 'href';
                val = attr.value;
                break attrsSearch;
            }
        }

        if (name !== undefined && val !== undefined) {
            if (el.tagName.toLowerCase() === 'img' && name === 'src') {
                const initialTransition = window.getComputedStyle(el).transition;
                const initialStyleTransition = el.style.transition;
                const lazyDelay = el.getAttribute(LAZY_ATTR_DELAY) || LAZY_DEFAULT_DELAY;
                const patchedTransition = el.style.transition = initialTransition + ', opacity ' + lazyDelay;

                const onload = () => {
                    el.classList.remove('lazy-loading');
                    if (el.style.transition === patchedTransition) {
                        el.style.transition = initialStyleTransition;
                    }
                    el.removeEventListener('load', onload);
                };

                el.addEventListener('load', onload);

                el.classList.add('lazy-loading');
            }

            const timeoutSecStr = el.getAttribute(LAZY_ATTR_TIMEOUT);
            if (timeoutSecStr) {
                const timeoutSec = parseFloat(timeoutSecStr);
                if (timeoutSec !== NaN && timeoutSec > 0) {
                    setTimeout(lazyLoad, timeoutSec, el, name, val);
                    return;
                } else {
                    console.warn('unknown -lazy-timeout format. should be float number that represent seconds', timeoutSecStr);
                }
            }
            lazyLoad(el, name, val);
        }
    });
}