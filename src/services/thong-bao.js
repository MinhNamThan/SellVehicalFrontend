import { THONG_BAO, HINH_ANH } from './api';
import { METHOD, request } from '@/utils/request';

export async function saveThongBao(params) {
    return request(THONG_BAO, METHOD.POST, params);
}

export async function updateThongBao(params) {
    return request(`${THONG_BAO}/${params.id}`, METHOD.PUT, params);
}

export async function getListThongBao(params) {
    return request(THONG_BAO, METHOD.GET, params);
}

export async function deleteThongBao(id) {
    return request(`${THONG_BAO}/${id}`, METHOD.DELETE);
}

export async function uploadHinhAnh(params) {
    return request(HINH_ANH, METHOD.POST, params);
}

export default {
    saveThongBao,
    updateThongBao,
    getListThongBao,
    deleteThongBao,
    uploadHinhAnh
};
