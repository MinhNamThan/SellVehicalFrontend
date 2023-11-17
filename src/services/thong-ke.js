import { THONG_KE } from './api';
import { METHOD, request } from '@/utils/request';

export async function getListThongKe({ from, to }) {
    return request(THONG_KE, METHOD.GET, { from, to });
}

export default { getListThongKe };
