const Lethargy = require("exports-loader?this.Lethargy!lethargy/lethargy");

let lethargy!: any;

export function isInertionScroll(evt: Event): boolean {
    if (!lethargy) lethargy = new Lethargy();

    /*
        lethargy.check(e) will return 1 if it is a normal scroll up event, -1 if it is a normal scroll down event, and false if it is initiated by inertial scrolling.
        Lethargy focus on preventing false positives (saying it's a normal scroll event when it wasn't), but tolerates false negatives (saying it's not a normal scroll event when it is).
    */
    const state: 1|-1|false = lethargy.check(evt);
    
    if(state === false) return true;
    return false;
}