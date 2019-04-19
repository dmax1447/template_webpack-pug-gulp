export function remFix(
    maximumBasePixel: number = 5,
    then?: (noRem: boolean, rootFontSize: number) => void
) {
    const rootFontSize = parseInt(window.getComputedStyle(document.querySelector('html')!).fontSize || '0', 10);
    const noRem = rootFontSize > maximumBasePixel;
    if (noRem) {
        document.querySelector('html')!.classList.toggle('no-rem');
    }
    if (then) then(noRem, rootFontSize);
}
