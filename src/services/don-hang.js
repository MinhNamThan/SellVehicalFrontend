import { METHOD, request } from '@/utils/request';
import { DON_HANG, TRANG_THAI_BAO_GIA } from './api';

export async function saveDonHang(params) {
    return request(DON_HANG, METHOD.POST, params);
}

export async function updateDonHang(params) {
    return request(`${DON_HANG}/${params.id}`, METHOD.PUT, params);
}

export async function getListDonHang({ per, page, search, status, from, to }) {
    return request(DON_HANG, METHOD.GET, { per, page, search, status, from, to });
}

export async function deleteDonHang(id) {
    return request(`${DON_HANG}/${id}`, METHOD.DELETE);
}

export async function updateTrangThaiDonHang(params) {
    return request(`${TRANG_THAI_BAO_GIA}/${params.publicId}`, METHOD.PUT, {
        status: params.status
    });
}

export default {
    saveDonHang,
    updateDonHang,
    getListDonHang,
    deleteDonHang,
    updateTrangThaiDonHang
};
