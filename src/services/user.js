import { ROUTES } from '@/services/api';
import { METHOD, removeAuthorization, request } from '@/utils/request';
import { BASE_USER, CHANGE_PASSWORD, LOGIN, PROFILE, REQUEST_LOGIN, USER } from './api';

export async function getProfile() {
    return request(PROFILE, METHOD.GET);
}

export async function updateProfile(payload) {
    return request(PROFILE, METHOD.PUT, payload);
}

export async function changePassword(payload) {
    return request(CHANGE_PASSWORD, METHOD.POST, payload);
}

export async function requestLogin(payload) {
    return request(REQUEST_LOGIN, METHOD.POST, payload);
}

export async function login(payload) {
    return request(LOGIN, METHOD.POST, payload);
}

export async function refreshToken(payload) {
    return request(`${BASE_USER}/refresh_token`, METHOD.POST, payload);
}

export async function getRoutesConfig() {
    return request(ROUTES, METHOD.GET);
}

export function logout() {
    localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY);
    localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY);
    localStorage.removeItem(process.env.VUE_APP_ROLES_KEY);
    localStorage.removeItem(process.env.VUE_APP_USER_KEY);
    removeAuthorization();
}

export async function saveUser(params) {
    return request(USER, METHOD.POST, params);
}

export async function updateUser(params) {
    return request(USER, METHOD.PATCH, params);
}

export async function getListUser() {
    return request(USER, METHOD.GET);
}

export async function getUser(id) {
    return request(`${USER}/${id}`, METHOD.GET);
}

export async function deleteUser(id) {
    return request(`${USER}/${id}`, METHOD.DELETE);
}

export default {
    requestLogin,
    login,
    getProfile,
    updateProfile,
    changePassword,
    refreshToken,
    getRoutesConfig,
    logout,
    saveUser,
    updateUser,
    getListUser,
    getUser,
    deleteUser
};
