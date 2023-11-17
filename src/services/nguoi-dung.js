import { USER } from './api';
import { METHOD, request } from '@/utils/request';

export async function saveNguoiDung(params) {
    return request(USER, METHOD.POST, params);
}

export async function updateNguoiDung(params) {
    return request(`${USER}/${params.id}`, METHOD.PUT, params);
}

export async function getListNguoiDung(params) {
    return request(USER, METHOD.GET, params);
}

export async function deleteNguoiDung(id) {
    return request(`${USER}/${id}`, METHOD.DELETE);
}

export default {
    saveNguoiDung,
    updateNguoiDung,
    getListNguoiDung,
    deleteNguoiDung
};
