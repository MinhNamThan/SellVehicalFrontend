import apiService from '@/services/thiet-bi';

export default {
    namespaced: true,
    state: {
        listThietBi: [],
        metadata: {}
    },
    getters: {},
    actions: {
        async updateThietBi(context, body) {
            await apiService.updateThietBi(body);
        },
        async getListThietBi(context, params) {
            const { data } = await apiService.getListThietBi(params);
            context.commit('setThietBiList', data.items);
            context.commit('setMetadata', data.metadata);
        }
    },
    mutations: {
        setThietBiList(state, list) {
            state.listThietBi = list;
        },
        setMetadata(state, metadata) {
            state.metadata = metadata;
        }
    }
};
