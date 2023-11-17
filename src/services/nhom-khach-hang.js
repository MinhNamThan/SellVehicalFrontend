import { CUSTOMER_GROUP } from './api';
import { METHOD, request } from '@/utils/request';

export async function saveNhomKhachHang(params) {
    return request(CUSTOMER_GROUP, METHOD.POST, params);
}

export async function updateNhomKhachHang(params) {
    return request(`${CUSTOMER_GROUP}/${params.id}`, METHOD.PUT, params);
}

export async function getListNhomKhachHang() {
    return request(CUSTOMER_GROUP, METHOD.GET);
}

export async function deleteNhomKhachHang(id) {
    return request(`${CUSTOMER_GROUP}/${id}`, METHOD.DELETE);
}

export default {
    saveNhomKhachHang,
    updateNhomKhachHang,
    getListNhomKhachHang,
    deleteNhomKhachHang
};
