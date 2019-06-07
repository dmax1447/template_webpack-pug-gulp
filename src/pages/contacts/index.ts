import './index.scss';
declare var ymaps: any;

if (true === true) {
    require('./no-rem.scss');
}

function init_ymap(pos: number[], label: string) {
    const map = new ymaps.Map("map", {
        center: [pos[0], pos[1]],
        zoom: 17
    });

    map.geoObjects
        .add(new ymaps.Placemark(pos, {
            iconCaption: label
        }, {
            iconCaptionMaxWidth: '150'
        }));
}

window.addEventListener('load', () => {
    init_ymap([55.690732, 37.659714], 'мы здесь');
});