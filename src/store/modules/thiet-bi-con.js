import apiService from '@/services/thiet-bi-con';

export default {
    namespaced: true,
    state: {
        listThietBiCon: []
    },
    getters: {},
    actions: {
        async getListThietBiCon(context, gatewayId) {
            const { data } = await apiService.getListThietBiCon(gatewayId);
            context.commit('setThietBiConList', data);
        }
    },
    mutations: {
        setThietBiConList(state, list) {
            state.listThietBiCon = list;
        }
    }
};
