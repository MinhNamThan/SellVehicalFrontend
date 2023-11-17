import { PHIEN_BAN } from './api';
import { METHOD, request } from '@/utils/request';

export async function savePhienBan(params) {
    return request(PHIEN_BAN, METHOD.POST, params);
}

export async function updatePhienBan(params) {
    return request(PHIEN_BAN, METHOD.PUT, params);
}

export async function getListPhienBan(params) {
    return request(PHIEN_BAN, METHOD.GET, params);
}

export async function deletePhienBan(id) {
    return request(`${PHIEN_BAN}/${id}`, METHOD.DELETE);
}

export default {
    savePhienBan,
    updatePhienBan,
    getListPhienBan,
    deletePhienBan
};
