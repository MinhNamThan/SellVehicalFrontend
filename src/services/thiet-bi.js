import { METHOD, request } from '@/utils/request';
import { GATEWAY } from './api';

export async function updateThietBi(params) {
    return request(`${GATEWAY}/${params.id}`, METHOD.PUT, params);
}

export async function getListThietBi({ per, page, mac, name, email, platform, tunnel, status }) {
    return request(GATEWAY, METHOD.GET, { per, page, mac, name, email, platform, tunnel, status });
}

export default { updateThietBi, getListThietBi };
