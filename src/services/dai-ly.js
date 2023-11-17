import { DAI_LY } from './api';
import { METHOD, request } from '@/utils/request';

export async function saveDaiLy(params) {
    return request(DAI_LY, METHOD.POST, params);
}

export async function updateDaiLy(params) {
    return request(`${DAI_LY}/${params.id}`, METHOD.PUT, params);
}

export async function getListDaiLy(payload) {
    return request(
        `${DAI_LY}?page=${payload.page}&per=${payload.per}&search=${payload.search}`,
        METHOD.GET
    );
}
export async function getFullListDaiLy() {
    return request(DAI_LY, METHOD.GET);
}

export async function deleteDaiLy(id) {
    return request(`${DAI_LY}/${id}`, METHOD.DELETE);
}

export default {
    saveDaiLy,
    updateDaiLy,
    getListDaiLy,
    deleteDaiLy,
    getFullListDaiLy
};
