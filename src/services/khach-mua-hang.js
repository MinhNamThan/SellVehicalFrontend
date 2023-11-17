import { KHACH_MUA_HANG } from './api';
import { METHOD, request } from '@/utils/request';

export async function saveKhachMuaHang(params) {
    return request(KHACH_MUA_HANG, METHOD.POST, params);
}

export async function updateKhachMuaHang(params) {
    return request(`${KHACH_MUA_HANG}/${params.id}`, METHOD.PUT, params);
}

export async function getListKhachMuaHang(search) {
    return request(KHACH_MUA_HANG, METHOD.GET, { search });
}

export async function deleteKhachMuaHang(id) {
    return request(`${KHACH_MUA_HANG}/${id}`, METHOD.DELETE);
}

export default { saveKhachMuaHang, updateKhachMuaHang, getListKhachMuaHang, deleteKhachMuaHang };
