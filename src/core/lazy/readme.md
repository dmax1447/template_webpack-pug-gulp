Simple framework for automated lazy loading.

Example for loading video & placeholder:
```pug
img(-lazy-src=(videoSrc + ".jpg"), -lazy-fade="0.5s", -lazy-delay="1s")
video(playsinline autoplay muted)
    source(type="video/mp4", -lazy-src=videoSrc, -lazy-fade="0.5s", -lazy-delay="2s")
```

## Setup

Invoke `loadAllLazied` after `window.onload` handled and all major code executed.

Eg:
```js
window.onload = () => {
    // ... setup some handlers ...
    // ... init some libraries ...

    loadAllLazied();
};
```

## Lazify!

To lazify element, there are some special attributes.

For lazily set any attribute:
* `-lazy-attr` - Specify which attribute will be set.
* `-lazy-value` - Specify value of an attribute.

For lazily set `src` attribute:
* `-lazy-src` - Lazily set `src` attribute. Invokes `.load` on parent if `source` element is lazied.

For lazily set `srcset` attribute:
* `-lazy-srcset` - Lazily set `srcset` attribute. Invokes `.load` on parent if `source` element is lazied.

For lazily set `href` attribute:
* `-lazy-href`

And some optional params:
* `-lazy-fade` - Fade-in time in seconds. Element will start appearing after `onload` event handled. (`'1s'` by default )
* `-lazy-delay` - Timeout after `loadAllLazied` and before loading starts.