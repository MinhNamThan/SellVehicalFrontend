import apiService from '@/services/ung-dung';

export default {
    namespaced: true,
    state: {
        listUngDung: []
    },
    getters: {},
    actions: {
        async saveUngDung(context, body) {
            await apiService.saveUngDung(body);
        },
        async updateUngDung(context, body) {
            await apiService.updateUngDung(body);
        },
        async getListUngDung(context) {
            const { data } = await apiService.getListUngDung();
            context.commit('setUngDungList', data);
        },
        async deleteUngDung(context, id) {
            await apiService.deleteUngDung(id);
        }
    },
    mutations: {
        setUngDungList(state, list) {
            state.listUngDung = list;
        }
    }
};
