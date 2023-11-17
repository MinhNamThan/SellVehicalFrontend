import { CUSTOMER_GROUP_MEMBERS } from './api';
import { METHOD, request } from '@/utils/request';

export async function saveKhachHangTheoNhom(groupId, params) {
    return request(`${CUSTOMER_GROUP_MEMBERS}?groupId=${groupId}`, METHOD.POST, params);
}

export async function getListKhachHangTheoNhom(groupId) {
    return request(`${CUSTOMER_GROUP_MEMBERS}?groupId=${groupId}`, METHOD.GET);
}

export async function deleteKhachHangTheoNhom(groupId, customerId) {
    return request(
        `${CUSTOMER_GROUP_MEMBERS}?groupId=${groupId}&customerId=${customerId}`,
        METHOD.DELETE
    );
}

export default {
    saveKhachHangTheoNhom,
    getListKhachHangTheoNhom,
    deleteKhachHangTheoNhom
};
