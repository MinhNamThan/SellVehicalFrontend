import { AGENT_DEVICE } from './api';
import { METHOD, request } from '@/utils/request';

export async function saveDevice(payload) {
    return request(`${AGENT_DEVICE}`, METHOD.POST, payload);
}

export async function getAgentDevice(params) {
    return request(`${AGENT_DEVICE}`, METHOD.GET, params);
}

export async function deleteDevice(id) {
    return request(`${AGENT_DEVICE}/${id}`, METHOD.DELETE);
}

export default { saveDevice, getAgentDevice, deleteDevice };
