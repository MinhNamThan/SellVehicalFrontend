import { UNG_DUNG } from './api';
import { METHOD, request } from '@/utils/request';

export async function saveUngDung(params) {
    return request(UNG_DUNG, METHOD.POST, params);
}

export async function updateUngDung(params) {
    return request(`${UNG_DUNG}/${params.id}`, METHOD.PUT, params);
}

export async function getListUngDung() {
    return request(UNG_DUNG, METHOD.GET);
}

export async function deleteUngDung(id) {
    return request(`${UNG_DUNG}/${id}`, METHOD.DELETE);
}

export default {
    saveUngDung,
    updateUngDung,
    getListUngDung,
    deleteUngDung
};
