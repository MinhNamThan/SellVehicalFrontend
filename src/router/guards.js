import { loginIgnore } from '@/router/index';
import { hasAuthority } from '@/utils/authority-utils';
import { checkAuthorization } from '@/utils/request';
import { getFirstRoutePath, isUnavailable } from '@/utils/routerUtil';
import NProgress from 'nprogress';
import { Modal } from 'ant-design-vue';
import _ from 'lodash';

NProgress.configure({ showSpinner: false });

const progressStart = (to, from, next) => {
    // start progress bar
    if (!NProgress.isStarted()) {
        NProgress.start();
    }
    next();
};

const loginGuard = (to, from, next) => {
    if (!loginIgnore.includes(to) && !checkAuthorization()) {
        next({ path: '/dang-nhap' });
    } else {
        next();
    }
};

const authorityGuard = async (to, from, next, options) => {
    if (to.path !== '/' && isUnavailable(to.path)) {
        next({ path: '/404' });
        NProgress.done();
        return;
    }

    const { store, notification } = options;

    if (
        to.path !== '/dang-nhap' &&
        from.path !== '/dang-nhap' &&
        to.path.indexOf('/bao-gia') !== 0 &&
        !(to.path === '/404' && from.path.indexOf('/bao-gia') === 0)
    ) {
        await store.dispatch('account/getProfile');
    }

    if (to.path === '/') {
        const path = getFirstRoutePath();
        if (!path) {
            notification.error({
                message: 'Tài khoản này không có quyền truy cập trang web'
            });
            return next({ path: '/dang-nhap' });
        } else {
            return next({ path });
        }
    }

    const permissions = store.getters['account/permissions'];
    const roles = store.getters['account/roles'];

    if (!hasAuthority(to, permissions, roles)) {
        next({ path: '/403' });
        NProgress.done();
    } else {
        next();
    }
};

const redirectGuard = (to, from, next, options) => {
    const { store } = options;
    const getFirstChild = (routes) => {
        const route = routes[0];
        if (!route.children || route.children.length === 0) {
            return route;
        }
        return getFirstChild(route.children);
    };
    if (store.state.setting.layout === 'mix') {
        const firstMenu = store.getters['setting/firstMenu'];
        if (firstMenu.find((item) => item.fullPath === to.fullPath)) {
            store.commit('setting/setActivatedFirst', to.fullPath);
            const subMenu = store.getters['setting/subMenu'];
            if (subMenu.length > 0) {
                const redirect = getFirstChild(subMenu);
                return next({ path: redirect.fullPath });
            }
        }
    }
    next();
};

const progressDone = () => {
    // finish progress bar
    NProgress.done();
};

const baoGiaGuard = (to, from, next, options) => {
    if (from.path == '/quan-ly-bao-gia') {
        const { store } = options;
        let baoGia = store.state.baoGia.baoGia;
        if (Object.keys(baoGia).length != 0 && baoGia.constructor === Object) {
            let baoGiaSaved = store.state.baoGia.baoGiaSaved;
            delete baoGia.createdAt;
            delete baoGia.updatedAt;
            delete baoGia.expiredTime;
            delete baoGiaSaved.createdAt;
            delete baoGiaSaved.updatedAt;
            delete baoGiaSaved.expiredTime;
            if (!baoGiaSaved.id || !_.isEqual(baoGia, baoGiaSaved)) {
                Modal.confirm({
                    title: 'Chưa lưu báo giá?',
                    content: 'Bạn có chắc muốn rời đi',
                    onOk() {
                        next();
                    },
                    onCancel() {
                        return false;
                    },
                    class: 'test'
                });
            } else next();
        } else next();
    } else next();
};

export default {
    beforeEach: [progressStart, loginGuard, authorityGuard, redirectGuard, baoGiaGuard],
    afterEach: [progressDone]
};
