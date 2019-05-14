/**
 * fix some issues when rems is not supported  
 * (eg old android's borwserview that is used on some instagram versions)
 * 
 * Default html:font-size on unsupported browsers are greather that maximum used base pixel.  
 * So if font-size on html element is greather that max base pixel, browser not support rems.
 */
export function remFix(
    maximumBasePixel: number = 5,
    then?: (noRem: boolean, rootFontSize: number) => void
) {
    const rootFontSize = parseInt(window.getComputedStyle(document.querySelector('html')!).fontSize || '0', 10);
    const noRem = rootFontSize > maximumBasePixel;
    if (noRem) {
        document.querySelector('html')!.classList.add('no-rem');
    }
    if (then) then(noRem, rootFontSize);
}
