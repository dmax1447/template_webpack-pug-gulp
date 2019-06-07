import './index.scss';

if (process.env.BUILD === 'prod') {
    require('./no-rem.scss');
}