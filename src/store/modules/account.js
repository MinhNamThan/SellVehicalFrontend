import { setAuthorization } from '@/utils/request';
import userService from '../../services/user';

export default {
    namespaced: true,
    state: {
        user: null,
        permissions: null,
        roles: null,
        routesConfig: null,
        refreshToken: null,
        expirationDate: null
    },
    getters: {
        user: (state) => {
            if (!state.user) {
                try {
                    const user = localStorage.getItem(process.env.VUE_APP_USER_KEY);
                    state.user = JSON.parse(user);
                } catch (e) {
                    console.error(e);
                }
            }
            return state.user;
        },
        refreshToken: (state) => {
            if (!state.refreshToken) {
                try {
                    const refreshToken = localStorage.getItem(
                        process.env.VUE_APP_REFRESH_TOKEN_KEY
                    );
                    state.refreshToken = JSON.parse(refreshToken);
                } catch (e) {
                    console.error(e);
                }
            }
            return state.refreshToken;
        },
        tokenExpirationDate: (state) => {
            if (!state.expirationDate) {
                try {
                    const expirationDate = localStorage.getItem(
                        process.env.VUE_APP_TOKEN_EXPIRATION_DATE
                    );
                    state.expirationDate = JSON.parse(expirationDate);
                } catch (e) {
                    console.error(e);
                }
            }
            return state.expirationDate;
        },
        permissions: (state) => {
            if (!state.permissions) {
                try {
                    const permissions = localStorage.getItem(process.env.VUE_APP_PERMISSIONS_KEY);
                    state.permissions = JSON.parse(permissions);
                    state.permissions = state.permissions ? state.permissions : [];
                } catch (e) {
                    console.error(e.message);
                }
            }
            return state.permissions;
        },
        roles: (state) => {
            if (!state.roles) {
                try {
                    const roles = localStorage.getItem(process.env.VUE_APP_ROLES_KEY);
                    state.roles = JSON.parse(roles);
                    state.roles = state.roles ? state.roles : [];
                } catch (e) {
                    console.error(e.message);
                }
            }
            return state.roles;
        },
        routesConfig: (state) => {
            if (!state.routesConfig) {
                try {
                    const routesConfig = localStorage.getItem(process.env.VUE_APP_ROUTES_KEY);
                    state.routesConfig = JSON.parse(routesConfig);
                    state.routesConfig = state.routesConfig ? state.routesConfig : [];
                } catch (e) {
                    console.error(e.message);
                }
            }
            return state.routesConfig;
        }
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
            localStorage.setItem(process.env.VUE_APP_USER_KEY, JSON.stringify(user));
        },
        setRefreshToken(state, refreshToken) {
            state.refreshToken = refreshToken;
            localStorage.setItem(
                process.env.VUE_APP_REFRESH_TOKEN_KEY,
                JSON.stringify(refreshToken)
            );
        },
        setTokenExpirationDate(state, expirationDate) {
            state.expirationDate = expirationDate;
            localStorage.setItem(
                process.env.VUE_APP_TOKEN_EXPIRATION_DATE,
                JSON.stringify(expirationDate)
            );
        },
        setPermissions(state, permissions) {
            state.permissions = permissions;
            if (permissions)
                localStorage.setItem(
                    process.env.VUE_APP_PERMISSIONS_KEY,
                    JSON.stringify(permissions)
                );
            else localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY);
        },
        setRoles(state, roles) {
            state.roles = roles;
            localStorage.setItem(process.env.VUE_APP_ROLES_KEY, JSON.stringify(roles));
        },
        setRoutesConfig(state, routesConfig) {
            state.routesConfig = routesConfig;
            localStorage.setItem(process.env.VUE_APP_ROUTES_KEY, JSON.stringify(routesConfig));
        }
    },
    actions: {
        requestLogin(context, payload) {
            return userService.requestLogin(payload);
        },
        login(context, payload) {
            return userService.login(payload);
        },
        async getProfile(context) {
            const { data } = await userService.getProfile();
            context.commit('setUser', { ...context.state.user, ...data });
            context.commit('setPermissions', data.group?.permission);
        },
        async updateProfile(context, payload) {
            const { data } = await userService.updateProfile(payload);
            context.commit('setUser', { ...context.state.user, ...data });
        },
        changePassword(context, payload) {
            return userService.changePassword(payload);
        },
        async doRefreshToken(context, payload) {
            const { data } = await userService.refreshToken(payload);
            setAuthorization({
                token: data.access_token,
                expireAt: new Date(data.expire_date)
            });
            context.commit('setTokenExpirationDate', data.expire_date);
        },
        logout() {
            return userService.logout();
        },
        async getUser(context, id) {
            const { data } = await userService.getUser(id);
            localStorage.setItem(process.env.VUE_APP_USER_KEY, JSON.stringify(data));
        }
    }
};
