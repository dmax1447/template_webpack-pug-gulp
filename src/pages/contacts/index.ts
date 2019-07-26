import './index.scss';
declare var ymaps: any;

if (BUILD_MODE === 'prod') {
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
    init_ymap([55.702850, 37.648465], 'мы здесь');
});