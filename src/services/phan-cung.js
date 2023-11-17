import { HARDWARE } from './api';
import { METHOD, request } from '@/utils/request';

export async function savePhanCung(params) {
    return request(HARDWARE, METHOD.POST, params);
}

export async function getListPhanCung() {
    return request(HARDWARE, METHOD.GET);
}

export async function deletePhanCung(id) {
    return request(`${HARDWARE}/${id}`, METHOD.DELETE);
}

export default {
    savePhanCung,
    getListPhanCung,
    deletePhanCung
};
