import './index.scss';

if (BUILD_MODE === 'prod') {
    require('./no-rem.scss');
}