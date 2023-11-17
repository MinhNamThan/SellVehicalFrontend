import { CUSTOMER, KICKOUT_CUSTOMER, CHANGE_CUSTOMER } from './api';
import { METHOD, request } from '@/utils/request';

export async function updateKhachHang(params) {
    return request(`${CUSTOMER}/${params.id}`, METHOD.PUT, params);
}

export async function getListKhachHang(per, page, search) {
    return request(CUSTOMER, METHOD.GET, { per, page, search });
}

export async function kickOutKhachHang(id) {
    return request(`${KICKOUT_CUSTOMER}/${id}`, METHOD.DELETE);
}

export async function swapKhachHang(params) {
    return request(CHANGE_CUSTOMER, METHOD.POST, params);
}

export async function deleteKhachHang(id) {
    return request(`${CUSTOMER}/${id}`, METHOD.DELETE);
}

export default {
    updateKhachHang,
    getListKhachHang,
    kickOutKhachHang,
    swapKhachHang,
    deleteKhachHang
};
