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

    const prevHtmlFontSize = htmlEl.style.fontSize;
    htmlEl.style.fontSize = '10px';

    const remTestEl = document.createElement('div');
    remTestEl.setAttribute('style', 'height: 2rem !important; min-height: 2rem !important; max-height: 2rem !important;');
    document.body.appendChild(remTestEl);

    const testHeight = remTestEl.getBoundingClientRect().height;
    const badRem = testHeight !== 20;

    remTestEl.remove();
    htmlEl.style.fontSize = prevHtmlFontSize;

    if (badRem) {
        htmlEl.classList.add('no-rem');
    }

    if (then) then(badRem);
}
