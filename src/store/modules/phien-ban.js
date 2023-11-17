import apiService from '@/services/phien-ban';

export default {
    namespaced: true,
    state: {
        listPhienBan: []
    },
    getters: {},
    actions: {
        async savePhienBan(context, body) {
            await apiService.savePhienBan(body);
        },
        async updatePhienBan(context, body) {
            await apiService.updatePhienBan(body);
        },
        async getListPhienBan(context, params) {
            const { data } = await apiService.getListPhienBan(params);
            context.commit('setPhienBanList', data);
        },
        async deletePhienBan(context, id) {
            await apiService.deletePhienBan(id);
        }
    },
    mutations: {
        setPhienBanList(state, list) {
            state.listPhienBan = list;
        }
    }
};
