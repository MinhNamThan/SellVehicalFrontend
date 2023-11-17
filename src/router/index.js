import { formatRoutes } from '@/utils/routerUtil';
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const loginIgnore = {
    names: ['404', '403', 'Báo giá public'],
    paths: ['/dang-nhap'],

    includes(route) {
        return this.names.includes(route.name) || this.paths.includes(route.path);
    }
};

function initRouter() {
    const options = require('./config').default;
    formatRoutes(options.routes);
    return new Router(options);
}
export { loginIgnore, initRouter };
