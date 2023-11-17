import apiService from '@/services/phan-cung';

export default {
    namespaced: true,
    state: {
        listPhanCung: []
    },
    getters: {},
    actions: {
        async savePhanCung(context, body) {
            const res = await apiService.savePhanCung(body);
            return res;
        },
        async getListPhanCung(context) {
            const { data } = await apiService.getListPhanCung();
            context.commit('setPhanCungList', data);
        },
        async deletePhanCung(context, id) {
            await apiService.deletePhanCung(id);
        }
    },
    mutations: {
        setPhanCungList(state, list) {
            state.listPhanCung = list;
        }
    }
};
