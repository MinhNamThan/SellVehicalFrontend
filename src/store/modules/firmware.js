import firmwareServices from '@/services/firmware';

export default {
    namespaced: true,
    state: {
        firmwareList: []
    },
    mutations: {
        setFirmwareList(state, data) {
            state.firmwareList = data;
        }
    },
    actions: {
        async getListFirmware({ commit }) {
            const { data } = await firmwareServices.getFirmWareList();
            commit('setFirmwareList', data);
        },
        async uploadFirmware(context, payload) {
            await firmwareServices.uploadFirmware(payload);
        },
        async releaseFirmware(context, id) {
            await firmwareServices.releaseFirmware(id);
        },
        async disableTestFirmware(context, id) {
            await firmwareServices.disableTestFirmware(id);
        },
        async deleteFirmware(context, id) {
            await firmwareServices.deleteFirmware(id);
        }
    }
};
