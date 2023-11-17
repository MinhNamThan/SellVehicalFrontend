import { USER_GROUP } from './api';
import { METHOD, request } from '@/utils/request';

export async function saveNhomNguoiDung(params) {
    return request(USER_GROUP, METHOD.POST, params);
}

export async function updateNhomNguoiDung(params) {
    return request(`${USER_GROUP}/${params.id}`, METHOD.PUT, params);
}

export async function getListNhomNguoiDung() {
    return request(USER_GROUP, METHOD.GET);
}

export async function deleteNhomNguoiDung(id) {
    return request(`${USER_GROUP}/${id}`, METHOD.DELETE);
}

export default {
    saveNhomNguoiDung,
    updateNhomNguoiDung,
    getListNhomNguoiDung,
    deleteNhomNguoiDung
};
