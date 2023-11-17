import { ENTITY } from './api';
import { METHOD, request } from '@/utils/request';

export async function getListThietBiCon(gatewayId) {
    return request(ENTITY, METHOD.GET, { gatewayId });
}

export default { getListThietBiCon };
