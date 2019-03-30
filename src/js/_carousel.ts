import {
    $, $all, prepareDragging, betweenRate,
} from './utils';

const CAROUSEL_SPEED = 2;

export function initCarousels() {
    $all('.carousel').forEach(initCarousel);
}

export function initCarousel(carouselEl: HTMLElement) {
    let active: HTMLElement|null = carouselEl.querySelector('.carousel-item--active') || carouselEl.children.item(1) as any || carouselEl.children.item(0) as any;

    if (!active) {
        throw new Error('no valid chidren found');
    }

    // float number of item position
    // normalize to integer
    let carouselPosition = 1;

    const items: HTMLElement[] = [];
    carouselEl.querySelectorAll('.carousel-item').forEach((x, i) => {
        if (active === x) carouselPosition = i;
        items.push(x as any)
    });

    // reset items
    let _afterActive = false;
    for (let itemIndex = 0; itemIndex < items.length; ++itemIndex) {
        const item = items[itemIndex];

        if (itemIndex === carouselPosition) item.classList.toggle('carousel-item--active', true);
        if (item !== active) {
            item.style.opacity = '0';
            if (!_afterActive) item.style.left = '0%';
            else item.style.left = '100%';
        }

        item.addEventListener('mousedown', () => itemMouseDown(item, items.indexOf(item)));
    }

    active.style.opacity = '100';
    active.style.left = '50%';

    function itemMouseDown(item: HTMLElement, itemIndex: number) {
        let bindDragX = 0;
        const lastCarouselPos = carouselPosition;
        
        function mouseMove(evt: MouseEvent) {
            const { clientX } = evt;
            const { left: cleft, width: cwidth } = carouselEl.getBoundingClientRect();
            const rateX = betweenRate(cleft, clientX, cleft + cwidth);

            const move = rateX * CAROUSEL_SPEED;
            carouselPosition = lastCarouselPos + move;

            console.log(move, carouselPosition);

            if (carouselPosition < 0) carouselPosition = items.length - 1;
            if (carouselPosition > (items.length - 1)) carouselPosition = 0;
            updateCarouselPositions();
        }

        function mouseUp() {
            window.removeEventListener('mousemove', mouseMove);
            window.removeEventListener('mouseup', mouseUp);
        }

        prepareDragging((evt) => {
            // start dragging
            bindDragX = evt.clientX;
            window.addEventListener('mousemove', mouseMove);
            window.addEventListener('mouseup', mouseUp);
        }, () => {
            carouselPosition = itemIndex;
            updateCarouselPositions();
        });
    }

    function updateCarouselPositions() {
        requestAnimationFrame(_updateCarouselPositionsFrame);
    }

    function _updateCarouselPositionsFrame() {
        for (let i = 0; i < items.length; ++i) {
            const item = items[i];
            const isActive = (i - 0.5) < carouselPosition && (i + 0.5) > carouselPosition;
            const isPrev = !isActive && i < carouselPosition && (i + 1.8) >= carouselPosition;
            const isNext = !isActive && i > carouselPosition && (i - 1.8) <= carouselPosition;
            const notVisible = !isPrev && !isNext && !isActive;

            // console.log({ i, isActive, isPrev, isNext, notVisible });

            if (notVisible) {
                item.classList.toggle('carousel-item--not-visible', true);
                item.classList.toggle('carousel-item--not-active', false);
                item.classList.toggle('carousel-item--active', false);
                item.classList.toggle('carousel-item--next', false);
                item.classList.toggle('carousel-item--prev', false);
                item.style.left = '0%';
                item.style.opacity = '0';
                continue;
            }

            if (isPrev) {
                item.classList.toggle('carousel-item--not-visible', false);
                item.classList.toggle('carousel-item--not-active', true);
                item.classList.toggle('carousel-item--active', false);
                item.classList.toggle('carousel-item--next', false);
                item.classList.toggle('carousel-item--prev', true);
                item.style.left = '0%';
                item.style.opacity = '0.3';
                continue;
            }

            if (isNext) {
                item.classList.toggle('carousel-item--not-visible', false);
                item.classList.toggle('carousel-item--not-active', true);
                item.classList.toggle('carousel-item--active', false);
                item.classList.toggle('carousel-item--next', true);
                item.classList.toggle('carousel-item--prev', false);
                item.style.left = '100%';
                item.style.opacity = '0.3';
                continue;
            }

            if (isActive) {
                const prevIndex = i - 1;
                const nextIndex = i + 1;

                const rate = betweenRate(prevIndex, carouselPosition, nextIndex);

                console.log(prevIndex, carouselPosition, nextIndex, '=', rate);

                item.style.left = `${rate * 100}%`;
                item.style.opacity = '1';

                item.classList.toggle('carousel-item--not-visible', false);
                item.classList.toggle('carousel-item--not-active', false);
                item.classList.toggle('carousel-item--active', true);
                item.classList.toggle('carousel-item--next', false);
                item.classList.toggle('carousel-item--prev', false);
                continue;
            }
        }
    }

    updateCarouselPositions();
}