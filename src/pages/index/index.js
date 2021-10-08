import './index.scss';

if (BUILD_MODE === 'prod') {
    require('./no-rem.scss');
}

function setup() {
    console.log('index/index.js')
}

window.addEventListener('load', setup);