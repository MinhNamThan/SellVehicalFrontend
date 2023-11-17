import store from '@/store';
import { mergeI18nFromRoutes } from '@/utils/i18n';
import deepMerge from 'deepmerge';

let appOptions = {
    router: undefined,
    i18n: undefined,
    store: undefined
};

function setAppOptions(options) {
    const { router, store, i18n } = options;
    appOptions.router = router;
    appOptions.store = store;
    appOptions.i18n = i18n;
}

function parseRoutes(routesConfig, routerMap) {
    let routes = [];
    routesConfig.forEach((item) => {
        let router = undefined,
            routeCfg = {};
        if (typeof item === 'string') {
            router = routerMap[item];
            routeCfg = { path: (router && router.path) || item, router: item };
        } else if (typeof item === 'object') {
            router = routerMap[item.router];
            routeCfg = item;
        }
        if (!router) {
            console.warn(
                `can't find register for router ${routeCfg.router}, please register it in advance.`
            );
            router = typeof item === 'string' ? { path: item, name: item } : item;
        }
        const meta = {
            authority: router.authority,
            icon: router.icon,
            page: router.page,
            link: router.link,
            params: router.params,
            query: router.query,
            ...router.meta
        };
        const cfgMeta = {
            authority: routeCfg.authority,
            icon: routeCfg.icon,
            page: routeCfg.page,
            link: routeCfg.link,
            params: routeCfg.params,
            query: routeCfg.query,
            ...routeCfg.meta
        };
        Object.keys(cfgMeta).forEach((key) => {
            if (cfgMeta[key] === undefined || cfgMeta[key] === null || cfgMeta[key] === '') {
                delete cfgMeta[key];
            }
        });
        Object.assign(meta, cfgMeta);
        const route = {
            path: routeCfg.path || router.path || routeCfg.router,
            name: routeCfg.name || router.name,
            component: router.component,
            redirect: routeCfg.redirect || router.redirect,
            meta: { ...meta, authority: meta.authority || '*' }
        };
        if (routeCfg.invisible || router.invisible) {
            route.meta.invisible = true;
        }
        if (routeCfg.children && routeCfg.children.length > 0) {
            route.children = parseRoutes(routeCfg.children, routerMap);
        }
        routes.push(route);
    });
    return routes;
}

function loadRoutes(routesConfig) {
    if (arguments.length > 0) {
        const arg0 = arguments[0];
        if (arg0.router || arg0.i18n || arg0.store) {
            routesConfig = arguments[1];
            console.error(
                'the usage of signature loadRoutes({router, store, i18n}, routesConfig) is out of date, please use the new signature: loadRoutes(routesConfig).'
            );
            console.error(
                '方法签名 loadRoutes({router, store, i18n}, routesConfig) 的用法已过时, 请使用新的方法签名 loadRoutes(routesConfig)。'
            );
        }
    }

    const { router, store, i18n } = appOptions;

    if (routesConfig) {
        store.commit('account/setRoutesConfig', routesConfig);
    } else {
        routesConfig = store.getters['account/routesConfig'];
    }
    mergeI18nFromRoutes(i18n, router.options.routes);
    const rootRoute = router.options.routes.find((item) => item.path === '/');
    const menuRoutes = rootRoute && rootRoute.children;
    if (menuRoutes) {
        store.commit('setting/setMenuData', menuRoutes);
    }
}

function deepMergeRoutes(target, source) {
    const mapRoutes = (routes) => {
        const routesMap = {};
        routes.forEach((item) => {
            routesMap[item.path] = {
                ...item,
                children: item.children ? mapRoutes(item.children) : undefined
            };
        });
        return routesMap;
    };
    const tarMap = mapRoutes(target);
    const srcMap = mapRoutes(source);

    const merge = deepMerge(tarMap, srcMap);

    const parseRoutesMap = (routesMap) => {
        return Object.values(routesMap).map((item) => {
            if (item.children) {
                item.children = parseRoutesMap(item.children);
            } else {
                delete item.children;
            }
            return item;
        });
    };
    return parseRoutesMap(merge);
}

function formatRoutes(routes) {
    routes.forEach((route) => {
        const { path } = route;
        if (!path.startsWith('/') && path !== '*') {
            route.path = '/' + path;
        }
    });
    formatAuthority(routes);
}

function formatAuthority(routes, pAuthorities = []) {
    routes.forEach((route) => {
        const meta = route.meta;
        const defaultAuthority = pAuthorities[pAuthorities.length - 1] || { permission: '*' };
        if (meta) {
            let authority = {};
            if (!meta.authority) {
                authority = defaultAuthority;
            } else if (typeof meta.authority === 'string') {
                authority.permission = meta.authority;
            } else if (typeof meta.authority === 'object') {
                authority = meta.authority;
                const { role } = authority;
                if (typeof role === 'string') {
                    authority.role = [role];
                }
                if (!authority.permission && !authority.role) {
                    authority = defaultAuthority;
                }
            }
            meta.authority = authority;
        } else {
            const authority = defaultAuthority;
            route.meta = { authority };
        }
        route.meta.pAuthorities = pAuthorities;
        if (route.children) {
            formatAuthority(route.children, [...pAuthorities, route.meta.authority]);
        }
    });
}

function getI18nKey(path) {
    const keys = path.split('/').filter((item) => !item.startsWith(':') && item != '');
    keys.push('name');
    return keys.join('.');
}

function loadGuards(guards, options) {
    const { beforeEach, afterEach } = guards;
    const { router } = options;
    beforeEach.forEach((guard) => {
        if (guard && typeof guard === 'function') {
            router.beforeEach((to, from, next) => guard(to, from, next, options));
        }
    });
    afterEach.forEach((guard) => {
        if (guard && typeof guard === 'function') {
            router.afterEach((to, from) => guard(to, from, options));
        }
    });
}

const routeList = [
    {
        path: '/quan-ly-san-pham',
        permission: 'san-pham'
    },
    {
        path: '/quan-ly-bao-gia',
        permission: 'bao-gia'
    },
    {
        path: '/quan-ly-don-hang',
        permission: 'don-hang'
    },
    {
        path: '/quan-ly-thiet-bi/danh-sach-phan-cung',
        permission: 'phan-cung'
    },
    { path: '/quan-ly-thiet-bi/danh-sach-firmware', permission: 'firmware' },
    {
        path: '/quan-ly-thiet-bi/danh-sach-ung-dung',
        permission: 'ung-dung'
    },
    {
        path: '/quan-ly-thiet-bi/danh-sach-thiet-bi',
        permission: 'thiet-bi'
    },
    { path: '/quan-ly-he-thong/nhom-nguoi-dung', permission: 'nhom-nguoi-dung' },
    {
        path: '/quan-ly-he-thong/danh-sach-nguoi-dung',
        permission: 'nguoi-dung'
    },
    {
        path: '/quan-ly-dai-ly/danh-sach-dai-ly',
        permission: 'dai-ly'
    },
    {
        path: '/quan-ly-dai-ly/thiet-bi-dai-ly',
        permission: 'thiet-bi-dai-ly'
    },
    { path: '/quan-ly-khach-hang/nhom-khach-hang', permission: 'nhom-khach-hang' },
    {
        path: '/quan-ly-khach-hang/danh-sach-khach-hang',
        permission: 'khach-hang'
    },
    {
        path: '/quan-ly-thong-bao',
        permission: 'thong-bao'
    },
    {
        path: '/ho-tro-ky-thuat',
        permission: 'ho-tro'
    },
    {
        path: '/bao-cao-thong-ke',
        permission: 'thong-ke'
    }
];

function getFirstRoutePath() {
    const permissions = store.getters['account/permissions'];
    if (permissions.length === 0) return undefined;
    const path = routeList.find((item) => permissions[item.permission].access === true)?.path;
    return path;
}

function isUnavailable(path) {
    return routeList.find(
        (item) => item.path.indexOf(path) === 0 && item.path.length > path.length
    );
}

export {
    parseRoutes,
    loadRoutes,
    formatAuthority,
    getI18nKey,
    loadGuards,
    deepMergeRoutes,
    formatRoutes,
    setAppOptions,
    getFirstRoutePath,
    isUnavailable
};
