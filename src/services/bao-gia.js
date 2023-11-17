import { METHOD, request } from '@/utils/request';
import { BAO_GIA, TRANG_THAI_BAO_GIA } from './api';

export async function saveBaoGia(params) {
    return request(BAO_GIA, METHOD.POST, params);
}

export async function updateBaoGia(params) {
    return request(`${BAO_GIA}/${params.id}`, METHOD.PUT, params);
}

export async function getListBaoGia({ per, page, search, agentId, status, from, to }) {
    return request(BAO_GIA, METHOD.GET, { per, page, search, agentId, status, from, to });
}

export async function deleteBaoGia(id) {
    return request(`${BAO_GIA}/${id}`, METHOD.DELETE);
}

export async function getBaoGiaPublic(publicId) {
    return request(`${BAO_GIA}/${publicId}`, METHOD.GET);
}

export async function updateTrangThaiBaoGia(params) {
    return request(`${TRANG_THAI_BAO_GIA}/${params.publicId}`, METHOD.PUT, {
        status: params.status
    });
}

export default {
    saveBaoGia,
    updateBaoGia,
    getListBaoGia,
    deleteBaoGia,
    getBaoGiaPublic,
    updateTrangThaiBaoGia
};
