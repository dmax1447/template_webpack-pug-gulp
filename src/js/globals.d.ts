interface Window {
    ym<CallbackCtx = any>(
        yandexCounter: string|number,
        reachGoal: 'reachGoal',
        targetId: string,
        params?: object,
        callback?: (this: CallbackCtx) => void,
        ctx?: CallbackCtx,
    ): void;
}