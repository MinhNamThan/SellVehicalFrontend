import apiService from '@/services/thiet-bi-dai-ly';

export default {
    namespaced: true,
    state: {
        agentDevice: [],
        metadata: {}
    },
    getters: {},
    actions: {
        async saveDevice(context, payload) {
            await apiService.saveDevice(payload);
        },
        async getAgentDevice(context, params) {
            const { data } = await apiService.getAgentDevice(params);
            context.commit('setAgentDevice', data.items);
            context.commit('setMetadata', data.metadata);
        },
        async deleteDevice(context, id) {
            await apiService.deleteDevice(id);
        }
    },
    mutations: {
        setAgentDevice(state, data) {
            state.agentDevice = data;
        },
        setMetadata(state, metadata) {
            state.metadata = metadata;
        }
    }
};
