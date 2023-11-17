import { METHOD, request } from '@/utils/request';
import { IMPORT_PRODUCT, PRODUCT, HINH_ANH } from './api';

export async function importSanPham(formData) {
    return request(IMPORT_PRODUCT, METHOD.POST, formData);
}

export async function updateSanPham(params) {
    return request(`${PRODUCT}/${params.id}`, METHOD.PUT, params);
}

export async function getListSanPham() {
    return request(PRODUCT, METHOD.GET);
}

export async function saveSanPham(params) {
    return request(PRODUCT, METHOD.POST, params);
}

export async function deleteSanPham(id) {
    return request(`${PRODUCT}/${id}`, METHOD.DELETE);
}

export async function uploadHinhAnh(params) {
    return request(HINH_ANH, METHOD.POST, params);
}

export default {
    importSanPham,
    updateSanPham,
    getListSanPham,
    saveSanPham,
    deleteSanPham,
    uploadHinhAnh
};
