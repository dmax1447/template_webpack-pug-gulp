import { isInertionScroll } from "./lethargy-scroll";

type MouseWheelListenerParams = {
    deltaY: number,
    deltaX: number,
    /** only if `opts.checkDirection` is set */
    directionX?: 'left'|'right',
    /** only if `opts.checkDirection` is set */
    directionY?: 'up'|'down',
    /** only if `opts.includeOriginalEvent` is set */
    event?: WheelEvent,
    /** only if `opts.checkInertion` is set */
    isInertion?: boolean,
};

export type MouseWheelListener<Target extends HTMLElement|Window = HTMLElement|Window> = (
    params: MouseWheelListenerParams,
    target: Target
) => void;

/** returns destructor */
export function listenMouseWheel<Target extends HTMLElement|Window>(
    target: Target,
    listener: MouseWheelListener<Target>,
    opts: {
        includeOriginalEvent?: boolean,
        /** sets `isInertion` param */
        checkInertion?: boolean,
        /** sets `directionX` & `directionY` params */
        checkDirection?: boolean,
    }
) {
    const handler = (evt: WheelEvent) => {
        const params: MouseWheelListenerParams = {
            deltaX: evt.deltaX,
            deltaY: evt.deltaY,
        };

        if (opts.includeOriginalEvent) params.event = evt;
        if (opts.checkInertion) params.isInertion = isInertionScroll(evt);
        if (opts.checkDirection) {
            params.directionY = evt.deltaY > 0 ? 'down' : 'up';
            params.directionX = evt.deltaX > 0 ? 'right' : 'left';
        }

        listener(params, target);
    };

    target.addEventListener('mousewheel', handler as any);

    const destroy = () => {
        target.removeEventListener('mousewheel', handler as any);
    };

    return destroy;
}