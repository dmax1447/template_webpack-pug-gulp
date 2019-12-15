import { isIE_10_11 } from "./utils";

/**
 * fix some issues when rems is not supported  
 * (eg old android's browserview that is used on some instagram versions)
 * 
 * Default html:font-size on unsupported browsers are greather that maximum used base pixel.  
 * So if font-size on html element is greather that max base pixel, browser not support rems.
 */
export function remFix(
    then?: (noRem: boolean) => void
) {
    const htmlEl = document.querySelector('html');
    if (!htmlEl) throw new Error('rem fix failed, no html element found');

    try {
        console.error('stop using this browser');
        if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
            var msViewportStyle = document.createElement("style");
            msViewportStyle.appendChild(
              document.createTextNode(
                "@-ms-viewport{width:auto!important}"
              )
            );
            document.getElementsByTagName("head")[0].
              appendChild(msViewportStyle);
        }
    } catch (err) {
        console.error(err);
    }
    
    const isIE = isIE_10_11();
    if (isIE) {
        htmlEl.classList.add('no-rem');
        if (then) then(true);
        return;
    }

    const prevHtmlFontSize = htmlEl.style.fontSize;
    htmlEl.style.fontSize = '30px';

    const remTestEl = document.createElement('div');
    remTestEl.setAttribute('style', 'width: 0.1rem !important; min-width: 0.1rem !important; max-width: 0.1rem !important;');
    document.body.appendChild(remTestEl);

    const testWidth = remTestEl.getBoundingClientRect().width;
    const badRem = isIE || testWidth !== 3;

    remTestEl.remove();
    htmlEl.style.fontSize = prevHtmlFontSize;

    if (badRem) {
        htmlEl.classList.add('no-rem');
    }

    if (then) then(badRem);
}
