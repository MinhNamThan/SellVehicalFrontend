import apiService from '@/services/dai-ly';

export default {
    namespaced: true,
    state: {
        listDaiLy: []
    },
    getters: {},
    actions: {
        async saveDaiLy(context, body) {
            await apiService.saveDaiLy(body);
        },
        async updateDaiLy(context, body) {
            await apiService.updateDaiLy(body);
        },
        async getListDaiLy(context, payload) {
            const { data } = await apiService.getListDaiLy(payload);
            context.commit('setDaiLyList', data.items);
        },
        async getFullListDaiLy(context) {
            const { data } = await apiService.getFullListDaiLy();
            context.commit('setDaiLyList', data.items);
        },
        async deleteDaiLy(context, id) {
            await apiService.deleteDaiLy(id);
        }
    },
    mutations: {
        setDaiLyList(state, list) {
            state.listDaiLy = list;
        }
    }
};
