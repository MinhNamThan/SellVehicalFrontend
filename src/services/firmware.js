import { FIRMWARE, UPLOAD_FIRMWARE, DISABLE_TEST_FIRMWARE, RELEASE_FIRMWARE } from './api';
import { METHOD, request } from '@/utils/request';

export async function getFirmWareList() {
    return request(FIRMWARE, METHOD.GET);
}

export async function uploadFirmware(params) {
    return request(UPLOAD_FIRMWARE, METHOD.POST, params);
}

export async function releaseFirmware(id) {
    return request(`${RELEASE_FIRMWARE}/${id}`, METHOD.POST);
}

export async function disableTestFirmware(id) {
    return request(`${DISABLE_TEST_FIRMWARE}/${id}`, METHOD.POST);
}

export async function deleteFirmware(id) {
    return request(`${FIRMWARE}/${id}`, METHOD.DELETE);
}

export default {
    getFirmWareList,
    uploadFirmware,
    releaseFirmware,
    disableTestFirmware,
    deleteFirmware
};
