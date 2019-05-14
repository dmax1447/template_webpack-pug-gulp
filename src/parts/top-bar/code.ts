export function initTopBars() {
    document.querySelectorAll<HTMLHeadingElement>('.top-bar').forEach(el => {
        initTopBar(el);
    });
}

export function initTopBar(topBarEl: HTMLHeadingElement) {
    const menuOpenBtn = topBarEl.querySelector('.top-bar__mobile-open-btn');
    const menuCloseBtn = topBarEl.querySelector('.top-bar__mobile-close-btn');
    const menuPanel = topBarEl.querySelector('.top-bar__menu');

    if (!menuOpenBtn || !menuPanel || !menuCloseBtn) {
        // `noNavMenu` flag
        return;
    }

    let _bodyOverflowY: string|null = null;

    const openMobileMenu = () => {
        topBarEl.classList.remove('top-bar--mobile-menu-closed');
        _bodyOverflowY = document.body.style.overflowY;
        document.body.style.overflowY = 'hidden';
    };

    const closeMobileMenu = () => {
        document.body.style.overflowY = _bodyOverflowY;
        topBarEl.classList.add('top-bar--mobile-menu-closed');
    };

    const menuOpenClick = () => openMobileMenu();

    menuOpenBtn.addEventListener('click', menuOpenClick);
    menuCloseBtn.addEventListener('click', closeMobileMenu);

    const destroy = () => {
        menuOpenBtn.removeEventListener('click', menuOpenClick);
        menuCloseBtn.removeEventListener('click', closeMobileMenu);
    };

    return destroy;
}